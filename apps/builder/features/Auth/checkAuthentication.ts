import { client } from "@open-decision/api-client";
import { ODError } from "@open-decision/type-classes";
import { GetServerSideProps } from "next";

export async function checkAuthentication({
  req,
  res,
}: Parameters<GetServerSideProps>[0]) {
  const OD = client({ urlPrefix: `${process.env.OD_API_ENDPOINT}/v1` });

  try {
    const { data: authData, response } = await OD.auth.refreshToken(
      {},
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );

    if (authData instanceof ODError) throw response;

    const authenticatedOD = client({
      token: authData.access.token,
      urlPrefix: `${process.env.OD_API_ENDPOINT}/v1`,
    });
    const { data: trees } = await authenticatedOD.trees.getCollection({});

    const setCookieHeader = response.headers.get("set-cookie");
    setCookieHeader ? res.setHeader("set-cookie", setCookieHeader) : null;
    return { props: { ...authData, trees } };
  } catch (error) {
    return {
      redirect: {
        destination: `/auth/login?from=/`,
        permanent: false,
      },
    };
  }
}
