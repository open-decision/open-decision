import { Stack } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { mietminderungTreeMock } from "@open-decision/type-classes";

export default function Index() {
  return (
    <Renderer.Root tree={mietminderungTreeMock}>
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
