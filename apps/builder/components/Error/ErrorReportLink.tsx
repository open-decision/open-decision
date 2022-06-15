import { Link, Icon } from "@open-decision/design-system";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

type Props = { children?: React.ReactNode };

export function ErrorReportLink({ children }: Props) {
  return (
    <Link
      css={{ color: "$primary11", fontWeight: 500 }}
      target="_blank"
      href="https://open-decision.org#contact"
    >
      {children ?? "Bug Reports"}
      <Icon css={{ marginLeft: "$1" }}>
        <ExternalLinkIcon />
      </Icon>
    </Link>
  );
}
