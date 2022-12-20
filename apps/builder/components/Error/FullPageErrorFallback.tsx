import { Stack, ErrorCard, ErrorCardProps } from "@open-decision/design-system";
import { Layout } from "../Layout";

export function FullPageErrorFallback(props: ErrorCardProps) {
  return (
    <Layout>
      <Stack className="flex-1" center>
        <ErrorCard {...props} />
      </Stack>
    </Layout>
  );
}
