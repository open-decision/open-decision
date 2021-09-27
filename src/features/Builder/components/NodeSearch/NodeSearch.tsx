import { useSelector } from "@xstate/react";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { matchSorter } from "match-sorter";
import { Box, Button, Input } from "@open-legal-tech/design-system";
import { useEditor } from "features/Builder/state/useEditor";

export function NodeSearch() {
  const service = useTree();
  const nodes = useSelector(service, (state) => state.context.nodes);
  const { setSelectedNodeId } = useEditor();
  const searchableNodes = Object.values(nodes);

  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredResults = matchSorter(searchableNodes, searchTerm, {
    keys: ["data.label"],
  });

  const [status, setStatus] = React.useState<"idle" | "searching">("idle");

  const showResults =
    status === "searching" && Boolean(searchTerm) && filteredResults.length > 0;

  return (
    <Box css={{ position: "relative", flex: "1" }}>
      <Input
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setStatus("searching");
        }}
        placeholder="Search"
        css={{ borderRadius: "$md", width: "100%" }}
      />
      {showResults && (
        <Box
          css={{
            position: "absolute",
            backgroundColor: "$gray2",
            width: "100%",
            marginTop: "$2",
            borderRadius: "$md",
            padding: "$2",
            display: "grid",
            gap: "$1",
          }}
        >
          {filteredResults.map((node) => (
            <Button
              variant="tertiary"
              key={node.id}
              css={{ justifyContent: "start" }}
              onClick={() => {
                setSelectedNodeId(node.id);
                setStatus("idle");
                setSearchTerm(node.data.label);
              }}
            >
              {node.data.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
