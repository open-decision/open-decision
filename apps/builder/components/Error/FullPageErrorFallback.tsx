import { Stack, ErrorCard, ErrorCardProps } from "@open-decision/design-system";
import { Layout } from "../Layout";

export function FullPageErrorFallback(props: ErrorCardProps) {
  return (
    <Layout>
      <Stack css={{ flex: 1 }} center>
        <ErrorCard {...props} />
      </Stack>
    </Layout>
  );
}
