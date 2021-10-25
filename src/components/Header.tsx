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
  IconButton,
} from "@open-legal-tech/design-system";
import { Edit2 } from "react-feather";
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
        <Logo />
        <Box css={{ display: "flex", alignItems: "center" }}>
          <Text
            as="h2"
            size="medium"
            css={{ color: "$gray11", fontWeight: 600 }}
          >
            Project File /
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
        <InlineInput
          IndicatorButton={
            <IconButton
              size="small"
              variant="ghost"
              label="Editiere den Projektnamen"
              Icon={<Edit2 />}
              css={{ colorScheme: "primary" }}
              alignByContent="left"
            />
          }
          name="projectName"
        />
      </Form>
    </BaseHeader>
  );
};
