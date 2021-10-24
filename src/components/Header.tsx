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

type HeaderProps = {
  css?: StyleObject;
};

export const Header: React.FC<HeaderProps> = ({ css }) => {
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
          <Form
            onSubmit={() => {
              return;
            }}
            initialValues={{ projectName: "" }}
          >
            <InlineInput
              IndicatorButton={
                <IconButton
                  size="small"
                  variant="ghost"
                  label="Editiere den Projektnamen"
                  Icon={<Edit2 />}
                  css={{ colorScheme: "primary" }}
                />
              }
              name="projectName"
            />
          </Form>
        </Box>
        <Box />
      </Content>
    </Container>
  );
};
