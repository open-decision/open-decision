import { Button, Icon, Row } from "@open-decision/design-system";
import {
  ZoomInIcon,
  ZoomOutIcon,
  EnterFullScreenIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useReactFlow } from "reactflow";
import { useEditor } from "../state";

type Props = { className?: string };

export function ZoomInOut({ className }: Props) {
  const t = useTranslations("builder.canvas.zoomInAndOut");
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { removeSelectedNodes } = useEditor();

  return (
    <Row
      className={`bg-layer-1 rounded-md p-1 border border-gray7 ${className}`}
    >
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
        onClick={() => {
          fitView({ duration: 200, maxZoom: 1, includeHiddenNodes: true });
          removeSelectedNodes();
        }}
        variant="neutral"
        square
        name={t("fitView.hiddenLabel")}
      >
        <Icon label={t("fitView.hiddenLabel")}>
          <EnterFullScreenIcon />
        </Icon>
      </Button>
    </Row>
  );
}
