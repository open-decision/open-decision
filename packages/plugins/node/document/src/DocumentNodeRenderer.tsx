import * as React from "react";
import {
  addNotification,
  Row,
  SubmitButton,
  VisuallyHidden,
} from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { useMutation } from "@tanstack/react-query";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { RendererPrimitives } from "@open-decision/renderer";
import { DocumentNodePlugin } from "./documentNodePlugin";
import { createReadableAnswers } from "./utils/createReadableAnswers";
import { isODError, ODError } from "@open-decision/type-classes";
import { useTranslations } from "next-intl";
import { NodeRenderer } from "@open-decision/plugins-node-helpers";
import { APIClient } from "@open-decision/api-client";

const DocumentNode = new DocumentNodePlugin();
export const DocumentNodeRenderer: NodeRenderer = ({ nodeId, ...props }) => {
  const {
    treeClient,
    environment,
    state: {
      context: { answers },
    },
  } = useInterpreter();

  const node = DocumentNode.get.single(nodeId)(treeClient);
  const readableAnswers = createReadableAnswers(answers, treeClient);

  const t = useTranslations("common.errors");

  const ref = React.useRef<HTMLAnchorElement | null>(null);
  const { mutate, data, isLoading } = useMutation(
    ["generateDocument"],
    async () => {
      if (node instanceof Error) throw node;

      if (!node.data.templateUuid) {
        throw new ODError({
          code: "MISSING_TEMPLATE_UUID",
          message: "Missing template uuid to generate document.",
        });
      }

      const { response } = await APIClient.trees[environment].generateDocument({
        params: { uuid: node.data.templateUuid },
        body: { variables: readableAnswers },
      });

      const blob = await response.blob();

      const file = new Blob([blob], { type: "application/xlsx" });

      return URL.createObjectURL(file);
    },
    {
      onSuccess: (data) => {
        if (!ref.current) return;

        ref.current.href = data;
        return ref.current.click();
      },
      onError: (error) => {
        if (isODError(error)) {
          addNotification({
            title: t(`${error.code}.short`),
            content: t(`${error.code}.long`),
            variant: "danger",
          });
        }
      },
    }
  );

  if (node instanceof Error) return null;

  return (
    <RendererPrimitives.Container
      nodeId={nodeId}
      successButtonLabel={node.rendererButtonLabel}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        {node.data.content ? (
          <RichTextRenderer
            content={node.data.content}
            key={node.id}
            className="px-0"
          />
        ) : null}
      </RendererPrimitives.ContentArea>
      <Row className="justify-end">
        <SubmitButton
          type="button"
          onClick={() => mutate()}
          className="max-w-max"
          isLoading={isLoading}
        >
          Vertrag generieren
        </SubmitButton>
        <VisuallyHidden>
          <a href={data} download={`Vertrag.docx`} ref={ref}>
            Datei speichern
          </a>
        </VisuallyHidden>
      </Row>
    </RendererPrimitives.Container>
  );
};
