import * as React from "react";
import {
  addNotification,
  buttonClasses,
  Row,
  SubmitButton,
} from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { useMutation } from "@tanstack/react-query";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { RendererPrimitives } from "@open-decision/renderer";
import { DocumentNodePlugin } from "./DocumentNodePlugin";
import { isODError, ODError } from "@open-decision/type-classes";
import { useTranslations } from "next-intl";
import { TNodeRenderer } from "@open-decision/plugins-node-helpers";
import { APIClient } from "@open-decision/api-client";
import { mapValues } from "remeda";
import { match } from "ts-pattern";
import {
  isGroupVariable,
  isPrimitiveVariable,
  IVariable,
} from "@open-decision/variables";

const DocumentNode = new DocumentNodePlugin();

export const DocumentNodeRenderer: TNodeRenderer = ({ nodeId, ...props }) => {
  const {
    treeClient,
    environment,
    state: {
      context: { variables },
    },
  } = useInterpreter();

  const node = DocumentNode.getSingle(nodeId)(treeClient);

  const t = useTranslations("common.errors");

  const { mutate, data, isLoading } = useMutation(
    ["generateDocument"],
    async () => {
      if (!node) return;

      if (!node.templateUuid) {
        throw new ODError({
          code: "MISSING_TEMPLATE_UUID",
          message: "Missing template uuid to generate document.",
        });
      }

      const restructureVariables = (variable: IVariable): any =>
        match(variable)
          .with({ type: "list" }, (variable) =>
            variable.value.map((value) =>
              isGroupVariable(value)
                ? restructureVariables(value)
                : value.readableValue
            )
          )
          .with({ type: "record" }, (variable) =>
            mapValues(variable.value, (value) =>
              isGroupVariable(value)
                ? restructureVariables(value)
                : value.readableValue
            )
          )
          .with({ type: "module" }, (variable) =>
            variable.value.map((value) =>
              mapValues(value.variables, (value) =>
                isGroupVariable(value)
                  ? restructureVariables(value)
                  : value.readableValue
              )
            )
          )
          .when(isPrimitiveVariable, (variable) => variable.readableValue)
          .run();

      console.log(mapValues(variables, restructureVariables));

      const { response } = await APIClient.trees[environment].generateDocument({
        params: { uuid: node.templateUuid },
        body: { variables: mapValues(variables, restructureVariables) },
      });

      const blob = await response.blob();

      const file = new Blob([blob], { type: "application/xlsx" });

      return URL.createObjectURL(file);
    },
    {
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

  if (!node) return null;

  return (
    <RendererPrimitives.Container
      nodeId={nodeId}
      successButtonLabel={node.rendererButtonLabel}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        {node.content ? (
          <RichTextRenderer
            content={node.content}
            key={node.id}
            className="px-0"
          />
        ) : null}
        <Row className="justify-end">
          {data ? (
            <a
              href={data}
              download="Dokument.docx"
              className={buttonClasses({ variant: "secondary" }, "w-full")}
            >
              Datei speichern
            </a>
          ) : (
            <SubmitButton
              type="button"
              variant="secondary"
              onClick={() => mutate()}
              className="w-full"
              isLoading={isLoading}
            >
              Vertrag generieren
            </SubmitButton>
          )}
        </Row>
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};
