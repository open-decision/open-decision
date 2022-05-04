import { Link, Icon } from "@open-decision/design-system";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export function FeedbackLink() {
  return (
    <Link
      css={{ color: "$primary11" }}
      target="_blank"
      href="https://openlegaltech.notion.site/2d499521722841caa9b5425f07fc72b4?v=6648850f80c5469688f94cc805f2e9b3"
    >
      Feedback Formular
      <Icon>
        <ExternalLinkIcon />
      </Icon>
    </Link>
  );
}
