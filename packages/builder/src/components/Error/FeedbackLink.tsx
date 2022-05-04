import { Link, Icon } from "@open-decision/design-system";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export function FeedbackLink() {
  return (
    <Link
      css={{ color: "$primary11" }}
      target="_blank"
      href="https://www.notion.so/openlegaltech/User-Section-b28aadaf6cdd49a58eea90db8ad22f08"
    >
      Feedback Formular
      <Icon>
        <ExternalLinkIcon />
      </Icon>
    </Link>
  );
}
