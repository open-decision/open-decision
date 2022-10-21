import { Edge } from "@open-decision/tree-type";
import { Form, SelectWithCombobox, SelectWithComboboxProps } from "@open-decision/design-system/src/Form";
import { Row } from "@open-decision/design-system/src/Layout";
import { StyleObject } from "@open-decision/design-system/src/stitches";
import { focusSelector } from "@open-decision/design-system/src/stitches/stateSelectors";
import { NodeLink, NodeLinkProps } from "@open-decision/design-system/src/TargetSelector/NodeLink";

export type TargetSelectorProps = {
  name: Form.CustomControlProps["name"];
  edge?: Edge.TEdge;
  inputCss?: StyleObject;
  nodeLinkCss?: StyleObject;
} & Pick<
  SelectWithComboboxProps,
  "onCreate" | "onSelect" | "selectOptions" | "value" | "setValue"
> &
  Pick<NodeLinkProps, "nodeName" | "onClick">;

export function TargetSelector({
  name,
  edge,
  setValue,
  onCreate,
  onSelect,
  inputCss,
  nodeLinkCss,
  selectOptions,
  value,
  nodeName,
  onClick,
}: TargetSelectorProps) {
  return (
    <Row>
      <NodeLink
        onClick={onClick}
        nodeName={nodeName}
        target={edge?.target}
        css={{
          [`${focusSelector}`]: {
            zIndex: "$10",
          },
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          ...nodeLinkCss,
        }}
      />
      <Form.CustomControl
        name={name}
        as={SelectWithCombobox}
        setValue={setValue}
        value={value}
        onCreate={onCreate}
        onSelect={onSelect}
        selectOptions={selectOptions}
        comboboxPlaceholder={
          selectOptions.length
            ? "Knoten suchen..."
            : "Neuen Knoten erstellen..."
        }
        selectPlaceholder="Zielknoten auswählen..."
        css={{
          flex: "1",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          ...inputCss,
        }}
      />
    </Row>
  );
}
