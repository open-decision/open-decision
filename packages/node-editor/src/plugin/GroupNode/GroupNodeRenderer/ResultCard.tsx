import {
  Heading,
  Icon,
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
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { IGroupNode } from "../GroupNodePlugin";
import { match } from "ts-pattern";

type Props = {
  result: IModuleVariable["value"][number];
  resultNumber: number;
  node: IGroupNode;
};

export function ResultCard({ result, resultNumber, node }: Props) {
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

  return (
    <Stack className="gap-6 border border-gray7 p-4 bg-layer-1 rounded-md">
      <Heading as="h2">
        {resultNumber}. {node.title ?? "Antwort"}
      </Heading>
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
        <h4 className={textClasses({}, "font-[500] text-gray11")}>
          {result.name}
        </h4>
        <Icon>
          <ChevronRightIcon />
        </Icon>
        <Text className="font-[600]">{result.readableValue}</Text>
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
        {module.value.map((item) => (
          <Stack>
            {Object.values(item).map((item) => {
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
