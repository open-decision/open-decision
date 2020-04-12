// @ts-nocheck
import { FlumeConfig, Colors, Controls } from "flume";

const config = new FlumeConfig();

config
  .addPortType({
    type: "string",
    name: "string",
    label: "Text",
    color: Colors.green,
    controls: [
      Controls.text({
        name: "string",
        label: "Text",
      }),
    ],
  })
  .addPortType({
    type: "question",
    name: "question",
    label: "Frage",
    color: Colors.orange,
    controls: [
      Controls.select({
        name: "question",
        label: "Frage",
        options: [
          { value: "Wie geht es ihnen?", label: "Befindlichkeit" },
          { value: "Haben sie heute schon gefrühstückt?", label: "Frühstück" },
        ],
      }),
    ],
  })
  .addPortType({
    type: "boolean",
    name: "boolean",
    label: "Wahr/Falsch",
    color: Colors.blue,
    controls: [
      Controls.checkbox({
        name: "boolean",
        label: "Wahr/Falsch",
      }),
    ],
  })
  .addPortType({
    type: "number",
    name: "number",
    label: "Nummer",
    color: Colors.red,
    controls: [
      Controls.number({
        name: "number",
        label: "Nummer",
      }),
    ],
  })
  .addNodeType({
    type: "yes_no",
    label: "Ja/Nein",
    description: "",
    initialWidth: 140,
    inputs: (ports) => [
      ports.boolean({
        name: "yes_no",
        label: "Ergebnis",
      }),
      ports.string({
        name: "ja",
        label: "Ja",
        hidePort: true,
      }),
      ports.string({
        name: "nein",
        label: "Nein",
        hidePort: true,
      }),
    ],
    outputs: (ports) => [ports.string({ label: "Antwort" })],
  })
  .addNodeType({
    type: "question",
    label: "Frage",
    description: "Stellen Sie eine Frage and den Nutzer.",
    initialWidth: 140,
    inputs: (ports) => [
      ports.question({
        label: "Frage",
        hidePort: true,
      }),
      ports.string({
        label: "1. Antwortmöglichkeit",
        hidePort: true,
      }),
      ports.string({
        label: "2. Antwortmöglichkeit",
        hidePort: true,
      }),
    ],
    outputs: (ports) => [ports.boolean({ label: "Antwort" })],
  })
  .addRootNodeType({
    type: "homepage",
    label: "Antwort",
    initialWidth: 170,
    inputs: (ports) => [
      ports.string({
        name: "description",
        label: "Erklärung",
      }),
      ports.string({
        name: "answer",
        label: "Antwortext",
      }),
    ],
  });

export default config;
