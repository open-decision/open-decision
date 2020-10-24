import { FlumeConfig, Colors, Controls } from "flume-test";

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
      ports.string({
        name: "yes_no",
        label: "Ergebnis",
      }),
      ports.number({
        name: "ja",
        label: "Ja",
        hidePort: true,
      }),
    ],
    outputs: (ports) => [ports.string({ label: "Antwort" })],
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
