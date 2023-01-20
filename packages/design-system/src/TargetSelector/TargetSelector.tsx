import { TNodeId, ZNodeId } from "@open-decision/tree-id";
import { useTreeClient } from "@open-decision/tree-sync";
import { IEdge, INode, TTreeClient } from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Form, SelectWithCombobox, SelectWithComboboxProps } from "../Form";
import { Row } from "../Layout";
import { addNotification } from "../Notifications";

export type onNodeCreate = (data: {
  name: string;
}) => (treeClient: TTreeClient) => INode;

export type onEdgeCreate = (
  data: Pick<IEdge, "source" | "target">
) => (treeClient: TTreeClient) => IEdge | ODError;

export type onTargetUpdate = (newTarget?: string) => void;

export type TargetSelectorProps = {
  name: string;
  nodeId: TNodeId;
  inputClassName?: string;
  className?: string;
  edge: IEdge;
  onNodeCreate: onNodeCreate;
  onEdgeCreate: onEdgeCreate;
  onTargetUpdate?: onTargetUpdate;
} & Pick<SelectWithComboboxProps, "selectOptions" | "id" | "withClearButton">;

export function TargetSelector({
  name,
  edge,
  nodeId,
  onEdgeCreate,
  onNodeCreate,
  onTargetUpdate,
  inputClassName,
  selectOptions,
  className,
  id,
  withClearButton,
}: TargetSelectorProps) {
  const t = useTranslations("common.errors");
  const { control } = Form.useFormContext();
  const treeClient = useTreeClient();

  return (
    <Row className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <SelectWithCombobox
              {...field}
              id={id}
              onCreate={(value) => {
                const childNode = treeClient.nodes.create.childNode(
                  nodeId,
                  onNodeCreate({ name: value })(treeClient)
                );

                if (!childNode) return;

                const newEdge = onEdgeCreate({
                  source: nodeId,
                  target: childNode.id,
                })(treeClient);

                if (newEdge instanceof ODError) {
                  return addNotification({
                    title: t(`${newEdge.code}.short`),
                    content: t(`${newEdge.code}.long`),
                    variant: "danger",
                  });
                }

                if (!edge) {
                  treeClient.edges.add(newEdge);
                } else {
                  treeClient.edges.update(edge.id, newEdge);
                }

                treeClient.nodes.add(childNode);
              }}
              onSelect={(newTarget) => {
                const parsedTarget = ZNodeId.safeParse(newTarget);

                if (!parsedTarget.success) return;

                const newEdge = onEdgeCreate({
                  source: nodeId,
                  target: parsedTarget.data,
                })(treeClient);

                if (newEdge instanceof ODError) {
                  return addNotification({
                    title: t(`${newEdge.code}.short`),
                    content: t(`${newEdge.code}.long`),
                    variant: "danger",
                  });
                }

                if (!edge) {
                  treeClient.edges.add(newEdge);
                } else {
                  treeClient.edges.update(edge.id, newEdge);
                }

                return onTargetUpdate?.(newTarget);
              }}
              selectOptions={selectOptions}
              comboboxPlaceholder={
                selectOptions.length
                  ? "Knoten suchen..."
                  : "Neuen Knoten erstellen..."
              }
              selectPlaceholder="Zielknoten auswählen..."
              className={`flex-1 rounded-md ${inputClassName}`}
              withClearButton={withClearButton}
            />
          );
        }}
      />
    </Row>
  );
}
