import { Stack } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { OD } from "../../utils/odClient";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.treeId) return;

  const response = OD.publishedTrees.getSingle({
    params: { uuid: params.treeId },
  });

  return json(await response);
};

export default function Index() {
  const data = useLoaderData();

  return (
    <Renderer.Root tree={data.treeData}>
      <Stack center css={{ layer: "2", height: "100%" }}>
        <Renderer.View
          css={{
            marginBlock: "$2",
            paddingInline: "$4",
            paddingBlock: "$4",
            height: "100%",
            maxWidth: "500px",

            "@desktop": {
              marginBlock: "$4",
            },
          }}
        />
      </Stack>
    </Renderer.Root>
  );
}
