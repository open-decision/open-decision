import { Button, Heading, Stack } from "@open-decision/design-system";
import { Card } from "../components/Card";
import { getDashboardLayout } from "../features/Dashboard/DashboardLayout";

export default function TriggerError() {
  return (
    <Stack css={{ gridColumn: "1 / -1", gridRow: "1 / -1" }} center>
      <Card center>
        <Heading>Internal</Heading>
        <Button
          onClick={() => {
            throw new Error("Test");
          }}
        >
          Trigger Error
        </Button>
      </Card>
    </Stack>
  );
}

TriggerError.getLayout = getDashboardLayout;
