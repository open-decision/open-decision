import {
  Field,
  Heading,
  Icon,
  Input,
  Label,
  Stack,
  styled,
  SubmitButton,
  useForm,
} from "@open-decision/design-system";
import { EyeClosedIcon, RocketIcon } from "@radix-ui/react-icons";
import { BaseHeader, MainContent } from "components";
import {
  useUserUpdateMutation,
  useDeleteUserMutation,
} from "features/Auth/settings.queries";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { Eye, User } from "react-feather";
import { QueryClientProvider } from "react-query";
import { queryClient } from "features/Data/queryClient";

export default function SettingsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsPageImpl />
    </QueryClientProvider>
  );
}

const StyledMainContent = styled(MainContent, {
  display: "grid",
  gridTemplateColumns: "1fr 200px 3fr 1fr",
  gridTemplateRows: "max-content max-content 1fr",
  layer: "3",
  height: "100vh",
  overflow: "hidden",
  gap: "$8",
});

const SideMenuLink = styled("a", Label, {
  padding: "$2 $3",
  borderRadius: "$md",
  textDecoration: "none",

  customIntentStyle: {
    backgroundColor: "$gray3",
  },

  "&[data-active='true']": {
    backgroundColor: "$gray5",
  },
});

SideMenuLink.defaultProps = { size: "medium" };

function SettingsPageImpl() {
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
      <BaseHeader css={{ gridColumn: "1 / -1" }} />
      <Heading size="large" as="h1" css={{ gridColumn: "2 / 4" }}>
        Einstellungen
      </Heading>
      <Stack css={{ gap: "$2", gridColumn: "2" }}>
        <Link href="#account" passHref>
          <SideMenuLink data-active={router.asPath.includes("account")}>
            <Icon css={{ fontSize: "1.5em" }}>
              <User />
            </Icon>
            Account
          </SideMenuLink>
        </Link>
        <Link href="#projects" passHref>
          <SideMenuLink data-active={router.asPath.includes("projects")}>
            <Icon css={{ fontSize: "1.5em" }}>
              <RocketIcon />
            </Icon>
            Projekte
          </SideMenuLink>
        </Link>
        <Link href="#display" passHref>
          <SideMenuLink data-active={router.asPath.includes("display")}>
            <Icon css={{ fontSize: "1.5em" }}>
              <Eye />
            </Icon>
            Display
          </SideMenuLink>
        </Link>
        <Link href="#privacy" passHref>
          <SideMenuLink data-active={router.asPath.includes("privacy")}>
            <Icon css={{ fontSize: "1.5em" }}>
              <EyeClosedIcon />
            </Icon>
            Privacy
          </SideMenuLink>
        </Link>
      </Stack>
      <Stack
        css={{
          gridColumn: 3,
          overflow: "auto",
          gap: "$6",
        }}
      >
        <Heading id="account">Account</Heading>
        <Stack
          css={{
            gap: "$4",
            layer: "1",
            padding: "$5",
            borderRadius: "$md",
          }}
        >
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
        </Stack>
        <Stack
          css={{
            gap: "$4",
            layer: "1",
            padding: "$5",
            borderRadius: "$md",
          }}
        >
          <Heading as="h3" size="small" css={{ marginTop: "$4" }}>
            Mailadresse ändern
          </Heading>
          <EmailForm onSubmit={({ newEmail }) => mutate({ email: newEmail })}>
            <Field label="Neue E-Mail Adresse">
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
        </Stack>
        <Stack
          css={{
            gap: "$4",
            flexDirection: "row",
            justifyContent: "space-between",
            layer: "1",
            padding: "$5",
            borderRadius: "$md",
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
        </Stack>
      </Stack>
    </StyledMainContent>
  );
}
