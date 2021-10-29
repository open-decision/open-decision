import React from "react";
import { Logo } from "components";
import {
  StyleObject,
  styled,
  Box,
  Text,
  Form,
  darkTheme,
  InlineInput,
} from "@open-legal-tech/design-system";
import { usePartOfTree } from "features/Builder/state/useTree";

const Container = styled("div", {
  backgroundColor: "$gray2",
  paddingInline: "$4",
});

const Content = styled("header", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
  $color: "$colors$gray1",
});

type BaseHeaderProps = { children?: React.ReactNode; css?: StyleObject };

export const BaseHeader = ({ children, css }: BaseHeaderProps) => {
  return (
    <Container css={css} className={darkTheme}>
      <Content>
        <Logo css={{ width: "40px", height: "40px" }} />
        <Box css={{ display: "flex", alignItems: "center", color: "$gray11" }}>
          <Text
            as="h2"
            size="medium"
            css={{ color: "inherit", fontWeight: 600 }}
          >
            Projekt:
          </Text>
          {children}
        </Box>
        <Box />
      </Content>
    </Container>
  );
};

type HeaderProps = {
  css?: StyleObject;
};

export const EditorHeader: React.FC<HeaderProps> = ({ css }) => {
  const [treeName, send] = usePartOfTree((state) => state.context.treeName);

  return (
    <BaseHeader css={css}>
      <Form
        onChange={({ values }) =>
          send({
            type: "updateTree",
            tree: {
              treeName: values.projectName,
            },
          })
        }
        initialValues={{ projectName: treeName ?? "" }}
      >
        <InlineInput css={{ color: "inherit" }} name="projectName" />
      </Form>
    </BaseHeader>
  );
};
