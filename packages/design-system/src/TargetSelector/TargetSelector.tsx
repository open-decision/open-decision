import { Edge } from "@open-decision/tree-type";
import { Form, SelectWithCombobox, SelectWithComboboxProps } from "../Form";
import { Row } from "../Layout";
import { StyleObject } from "../stitches";
import { focusSelector } from "../stitches/stateSelectors";
import { NodeLink, NodeLinkProps } from "./NodeLink";

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
