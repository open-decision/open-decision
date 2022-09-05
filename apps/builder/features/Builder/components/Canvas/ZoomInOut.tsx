import {
  Button,
  Icon,
  Row,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import {
  ZoomInIcon,
  ZoomOutIcon,
  EnterFullScreenIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useReactFlow } from "react-flow-renderer";

const Container = styled(Row, {
  layer: "1",
  borderRadius: "$md",
  padding: "$1",
  border: "$border$layer",
});

type Props = { css?: StyleObject };

export function ZoomInOut({ css }: Props) {
  const t = useTranslations("builder.canvas.zoomInAndOut");
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Container css={css}>
      <Button
        onClick={() => zoomIn({ duration: 200 })}
        variant="neutral"
        square
        name={t("zoomIn.hiddenLabel")}
      >
        <Icon label={t("zoomIn.hiddenLabel")}>
          <ZoomInIcon />
        </Icon>
      </Button>
      <Button
        onClick={() => zoomOut({ duration: 200 })}
        variant="neutral"
        square
        name={t("zoomOut.hiddenLabel")}
      >
        <Icon label={t("zoomOut.hiddenLabel")}>
          <ZoomOutIcon />
        </Icon>
      </Button>
      <Button
        onClick={() => fitView({ duration: 200, maxZoom: 1 })}
        variant="neutral"
        square
        name={t("fitView.hiddenLabel")}
      >
        <Icon label={t("fitView.hiddenLabel")}>
          <EnterFullScreenIcon />
        </Icon>
      </Button>
    </Container>
  );
}
