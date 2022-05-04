import { Link, Icon } from "@open-decision/design-system";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export function ErrorReportLink() {
  return (
    <Link
      css={{ color: "$primary11" }}
      target="_blank"
      href="https://www.notion.so/openlegaltech/Bug-Reports-69f5eb094eb645f599ae9e61ae363408"
    >
      Bug Reports
      <Icon>
        <ExternalLinkIcon />
      </Icon>
    </Link>
  );
}
