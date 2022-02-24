import {
  Button,
  Icon,
  styled,
  Text,
  Tooltip,
} from "@open-legal-tech/design-system";
import { Check, XOctagon } from "react-feather";

const SyncTooltipContent = styled(Tooltip.Content, {
  padding: "$3",
  display: "grid",
  gridTemplateColumns: "max-content fit-content(300px)",
  gap: "$2",
});

export function SyncIndicator() {
  const [syncState] = useSync();

  if (syncState.matches("sync"))
    return (
      <Button
        variant="secondary"
        size="extra-small"
        css={{ position: "absolute", left: 80, bottom: 10 }}
      >
        <LoadingSpinner />
      </Button>
    );

  if (syncState.matches("error"))
    return (
      <Button
        variant="secondary"
        size="extra-small"
        css={{
          position: "absolute",
          left: 80,
          bottom: 10,
          colorScheme: "danger",
        }}
      >
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icon>
              <XOctagon />
            </Icon>
          </Tooltip.Trigger>
          <SyncTooltipContent sideOffset={15} alignOffset={-10}>
            <Icon css={{ colorScheme: "danger" }} data-active>
              <XOctagon />
            </Icon>
            <Text size="small" css={{ gridColumn: 2 }}>
              Synchronisation fehlgeschlagen
            </Text>
            <Text
              size="extra-small"
              css={{ overflowWrap: "break-word", gridColumn: 2, gridRow: 2 }}
            >
              Wir können gerade nicht mit dem Server synchronisieren. Die
              Entwickler sind bereits informiert. Sollte das Problem weiterhin
              bestehen laden Sie die Seite bitte neu.
            </Text>
          </SyncTooltipContent>
        </Tooltip.Root>
      </Button>
    );

  return (
    <Button
      variant="secondary"
      size="extra-small"
      css={{
        position: "absolute",
        left: 80,
        bottom: 10,
        colorScheme: "success",
      }}
    >
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Icon>
            <Check />
          </Icon>
        </Tooltip.Trigger>
        <SyncTooltipContent sideOffset={15} alignOffset={-10}>
          <Icon css={{ colorScheme: "success" }} data-active>
            <Check />
          </Icon>
          <Text size="small">Projekt erfolgreich synchronisiert.</Text>
        </SyncTooltipContent>
      </Tooltip.Root>
    </Button>
  );
}
