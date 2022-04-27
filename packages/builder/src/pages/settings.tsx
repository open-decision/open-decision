import {
  activeStyle,
  Box,
  Field,
  Heading,
  Icon,
  Input,
  intentStyle,
  Label,
  Stack,
  styled,
  SubmitButton,
  useForm,
} from "@open-decision/design-system";
import { AvatarIcon } from "@radix-ui/react-icons";
import { BaseHeader, MainContent } from "components";
import { Card } from "components/Card";
import {
  useUserUpdateMutation,
  useDeleteUserMutation,
} from "features/Auth/settings.queries";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

const StyledMainContent = styled(MainContent, {
  display: "grid",
  gridTemplateColumns: "1fr 200px minmax(600px, 1fr) 1fr",
  gridTemplateRows: "max-content max-content 1fr",
  layer: "2",
  height: "100vh",
  columnGap: "$7",
});

const SideMenuLink = styled("a", Label, {
  position: "relative",
  padding: "$2 $3",
  borderRadius: "$md",
  textDecoration: "none",
  colorScheme: "primary",
  border: "2px solid transparent",

  ...activeStyle({
    backgroundColor: "$colorScheme2",
    borderColor: "$colorScheme6",
  }),

  ...intentStyle({
    backgroundColor: "$colorScheme3",
    focusColor: "$colorScheme7",
  }),
});

SideMenuLink.defaultProps = { size: "medium" };

export default function SettingsPage() {
  const router = useRouter();

  const { mutate, isLoading } = useUserUpdateMutation();
  const { mutate: deleteUserMutation, isLoading: isLoadingUserDelete } =
    useDeleteUserMutation();

  const [PasswordForm, { register: registerPasswordForm }] = useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const [EmailForm, { register: registerEmailForm }] = useForm({
    defaultValues: {
      newEmail: "",
    },
  });

  return (
    <StyledMainContent>
      <BaseHeader css={{ gridColumn: "1 / -1" }}>
        <Box css={{ flex: 1 }} />
      </BaseHeader>
      <Heading
        size="large"
        as="h1"
        css={{ gridColumn: "2 / 4", marginBlock: "$9 $7" }}
      >
        Einstellungen
      </Heading>
      <Stack css={{ gap: "$1", gridColumn: "2" }}>
        <Link href="#account" passHref>
          <SideMenuLink data-active={router.asPath.includes("account")}>
            <Icon css={{ fontSize: "1.5em" }}>
              <AvatarIcon />
            </Icon>
            Account
          </SideMenuLink>
        </Link>
      </Stack>
      <Stack css={{ gridColumn: 3 }}>
        <Stack
          css={{
            gap: "$3",
          }}
        >
          <Card>
            <Heading as="h3" size="small">
              Passwort ändern
            </Heading>
            <PasswordForm
              onSubmit={({ newPassword }) => mutate({ password: newPassword })}
            >
              <Field label="Neues Passwort">
                <Input
                  {...registerPasswordForm("newPassword")}
                  css={{ layer: "2" }}
                  type="password"
                  placeholder="********"
                />
              </Field>
              <SubmitButton
                isLoading={isLoading}
                variant="secondary"
                css={{ marginLeft: "auto", marginTop: "$3" }}
              >
                Passwort ändern
              </SubmitButton>
            </PasswordForm>
          </Card>
          <Card>
            <Heading as="h3" size="small" css={{ marginTop: "$4" }}>
              E-Mail ändern
            </Heading>
            <EmailForm onSubmit={({ newEmail }) => mutate({ email: newEmail })}>
              <Field label="Neue E-Mail">
                <Input
                  {...registerEmailForm("newEmail")}
                  css={{ layer: "2" }}
                  type="email"
                  placeholder="max.mustermann@gmx.de"
                />
              </Field>
              <SubmitButton
                isLoading={isLoading}
                variant="secondary"
                css={{ marginLeft: "auto", marginTop: "$3" }}
              >
                Mailadresse ändern
              </SubmitButton>
            </EmailForm>
          </Card>
          <Card
            css={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Heading as="h3" size="small">
              Account löschen
            </Heading>
            <SubmitButton
              onClick={() => deleteUserMutation()}
              isLoading={isLoadingUserDelete}
              colorScheme="danger"
              variant="secondary"
            >
              Account löschen
            </SubmitButton>
          </Card>
        </Stack>
      </Stack>
    </StyledMainContent>
  );
}
