import { Icon, Link, StyleObject, Text } from "@open-decision/design-system";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { InfoBox } from "../../features/Notifications/InfoBox";

export type ErrorCardProps = {
  title?: string;
  description?: string;
  css?: StyleObject;
};

export function ErrorCard({
  title = "Es ist ein unbekannter Fehler aufgetreten.",
  description = "Bitte lade die Seite neu.",
  css,
}: ErrorCardProps) {
  return (
    <InfoBox
      title={title}
      content={
        <>
          <Text size="large" css={{ marginBottom: "$6" }}>
            {description}
          </Text>
          <Text>
            Sollte der Fehler weiterhin auftreten dann erstelle bitte einen
            Bugreport hier:{" "}
            <Link href="https://www.notion.so/openlegaltech/a8a6b8db7e2b485294b6e31c1b3ae9da?v=ae3429d3f8d04d3395126baaa8147fe5">
              Feedback Formular
              <Icon>
                <ExternalLinkIcon />
              </Icon>
            </Link>
          </Text>
        </>
      }
      variant="danger"
      css={{ boxShadow: "$1", ...css }}
    />
  );
}
