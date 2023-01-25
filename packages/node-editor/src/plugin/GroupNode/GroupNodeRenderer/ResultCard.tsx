import {
  Button,
  Heading,
  Icon,
  Label,
  Row,
  Separator,
  Stack,
  Text,
  textClasses,
} from "@open-decision/design-system";
import {
  IModuleVariable,
  IPrimitiveVariable,
  isGroupVariable,
  IGroupVariable,
} from "@open-decision/variables";
import { ChevronRightIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { IGroupNode } from "../GroupNodePlugin";
import { match } from "ts-pattern";

type Props = {
  result: IModuleVariable["value"][number]["variables"];
  resultNumber: number;
  node: IGroupNode;
  onEdit: () => void;
};

export function ResultCard({ result, resultNumber, node, onEdit }: Props) {
  const NestedResult = (
    <Stack className="gap-4">
      {Object.values(result).map((value, index) => (
        <Stack className="gap-2" key={value.id}>
          {index > 0 ? <Separator /> : null}
          <Heading size="extra-small">{value.name}</Heading>
          {isGroupVariable(value) ? (
            createNestedResult(value)
          ) : (
            <PrimitiveResult key={value.id} result={value} />
          )}
        </Stack>
      ))}
    </Stack>
  );

  const nodeTitle = `${resultNumber}. ${node.title ?? "Antwort"}`;

  return (
    <Stack className="gap-6 border border-gray5 p-4 bg-layer-1 rounded-md">
      <Row className="items-center justify-between">
        <Heading as="h2" size="small">
          {nodeTitle}
        </Heading>
        <Button
          size="small"
          variant="secondary"
          onClick={onEdit}
          aria-label={`${nodeTitle} bearbeiten`}
        >
          <Icon>
            <Pencil1Icon />
          </Icon>
          Bearbeiten
        </Button>
      </Row>
      {NestedResult}
    </Stack>
  );
}

type PrimitiveResultProps = {
  result: IPrimitiveVariable;
};

const PrimitiveResult = ({ result }: PrimitiveResultProps) => {
  return (
    <Stack>
      <Row className="items-center mt-2 gap-2">
        <Label className={textClasses({})}>{result.name}</Label>
        <Icon>
          <ChevronRightIcon />
        </Icon>
        <Text>{result.readableValue}</Text>
      </Row>
    </Stack>
  );
};

const createNestedResult = (result: IGroupVariable) => {
  return match(result)
    .with({ type: "list" }, (list) => (
      <Stack className="gap-2">
        {list.value.map((item) => {
          if (isGroupVariable(item)) {
            return createNestedResult(item);
          }

          return <PrimitiveResult key={item.id} result={item} />;
        })}
      </Stack>
    ))
    .with({ type: "record" }, (record) => (
      <Stack className="gap-2">
        {Object.values(record.value).map((item) => {
          if (isGroupVariable(item)) {
            return createNestedResult(item);
          }

          return <PrimitiveResult key={item.id} result={item} />;
        })}
      </Stack>
    ))
    .with({ type: "module" }, (module) => (
      <Stack className="gap-2">
        {module.value.map(({ variables }) => (
          <Stack>
            {Object.values(variables).map((item) => {
              if (isGroupVariable(item)) {
                return createNestedResult(item);
              }

              return <PrimitiveResult key={item.id} result={item} />;
            })}
          </Stack>
        ))}
      </Stack>
    ))
    .run();
};
