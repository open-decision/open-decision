import { Stack } from "@open-decision/design-system";
import { Renderer } from "@open-decision/renderer";
import { mietminderungTreeMock } from "@open-decision/type-classes";

export default function Index() {
  return (
    <Stack center css={{ layer: "2", height: "100%" }}>
      <Renderer.Root tree={mietminderungTreeMock}>
        <Renderer.View
          css={{
            width: "500px",
            marginBlock: "$8",
            paddingBlock: "$1",
            height: "100%",
          }}
        />
      </Renderer.Root>
    </Stack>
  );
}
