import { Form, Heading, Row, stackClasses } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { RendererPrimitives } from "@open-decision/renderer";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { TModuleVariableValue } from "@open-decision/variables";
import { IGroupNode } from "../GroupNodePlugin";
import { AddEntryButton } from "./AddEntryButton";
import { ResultCard } from "./ResultCard";

type Props = Omit<RendererPrimitives.ContainerProps, "children" | "nodeId"> & {
  onSubmitGroup: (result: TModuleVariableValue) => void;
  groupNode: IGroupNode;
  results?: TModuleVariableValue["variables"][];
  onAddIteration: () => void;
  onGoBack?: () => void;
  onEdit: (index: number) => void;
};

export const MasterGroupNodeRenderer = ({
  onSubmitGroup,
  onAddIteration,
  groupNode,
  results = [],
  onEdit,
  ...props
}: Props) => {
  const { state } = useInterpreter();
  const methods = Form.useForm();

  return (
    <RendererPrimitives.Container nodeId={groupNode.id} {...props}>
      <RendererPrimitives.Form
        methods={methods}
        onSubmit={methods.handleSubmit(() => onSubmitGroup(state.context))}
      >
        <RendererPrimitives.ContentArea>
          {groupNode.content ? (
            <RichTextRenderer content={groupNode.content} className="px-0" />
          ) : null}
          <Row className="items-center justify-between">
            <Heading size="small" as="h3">
              Bisherige Antworten
            </Heading>
            <AddEntryButton
              onClick={onAddIteration}
              groupNodeId={groupNode.id}
            />
          </Row>
          {results.length > 0 ? (
            <ol className={stackClasses({}, ["gap-4 mb-4"])}>
              {results.map((value, index) => (
                <ResultCard
                  key={index}
                  result={value}
                  resultNumber={index + 1}
                  node={groupNode}
                  onEdit={() => onEdit(index)}
                />
              ))}
            </ol>
          ) : null}
        </RendererPrimitives.ContentArea>
      </RendererPrimitives.Form>
    </RendererPrimitives.Container>
  );
};
