import React from "react";
import {
  Button,
  Box,
  Dialog,
  Heading,
  Label,
  Input,
  useForm,
  ValidationMessage,
  ButtonProps,
} from "@open-legal-tech/design-system";
import { useCreateTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import { LoadingSpinner } from "components/LoadingSpinner";

export const NewTreeButton = (props: ButtonProps) => {
  const [Form, { register }] = useForm({ defaultValues: { treeName: "" } });

  const [open, setOpen] = React.useState(false);

  const { mutate: createTree, isLoading } = useCreateTreeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries("Trees");
      setOpen(false);
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button {...props}>Neues Projekt erstellen</Button>
      </Dialog.Trigger>
      <Dialog.Content
        css={{ minWidth: "350px", paddingTop: "$2", zIndex: "$10" }}
      >
        <Box
          css={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "$6",
            alignItems: "center",
          }}
        >
          <Dialog.Title asChild>
            <Heading size="extra-small">Neues Projekt erstellen</Heading>
          </Dialog.Title>
          <Dialog.CloseButton />
        </Box>
        <Form
          css={{ display: "flex", flexDirection: "column" }}
          onSubmit={({ treeName }) => createTree({ data: { name: treeName } })}
        >
          <Dialog.Description asChild>
            <Label size="small" htmlFor="treeName">
              Projektname
            </Label>
          </Dialog.Description>
          <Input
            autoFocus
            {...register("treeName", {
              required: {
                value: true,
                message: "Es muss ein Name vergeben werden.",
              },
            })}
            name="treeName"
            id="treeName"
            css={{ marginBlock: "$2" }}
            required
          />
          <ValidationMessage name="treeName" />
          <Button
            size="small"
            variant="secondary"
            css={{
              colorScheme: "success",
              alignSelf: "end",
              marginTop: "$6",
            }}
            type="submit"
          >
            {isLoading ? <LoadingSpinner colorScheme="success" /> : "Erstellen"}
          </Button>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
