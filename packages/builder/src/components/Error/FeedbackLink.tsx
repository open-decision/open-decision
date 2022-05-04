import { Link, Icon } from "@open-decision/design-system";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export function FeedbackLink() {
  return (
    <Link
      css={{ color: "$primary11" }}
      target="_blank"
      href="https://www.notion.so/openlegaltech/Feedback-c0047d9166974b49a99e0a43b5d06044"
    >
      Features
      <Icon>
        <ExternalLinkIcon />
      </Icon>
    </Link>
  );
}
