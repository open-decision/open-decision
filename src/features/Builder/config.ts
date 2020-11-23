import { FlumeConfig, Colors, Controls } from "flume";

const config = new FlumeConfig();

config
  .addPortType({
    type: "string",
    name: "string",
    color: Colors.green,
    controls: [Controls.text({ name: "test", label: "Test" })],
  })
  .addPortType({
    type: "comparison",
    name: "comparison",
    color: Colors.green,
    hidePort: true,
    label: "Wenn Input gleich",
    acceptTypes: ["string"],
    controls: [Controls.text({ label: "gleich", name: "comparison" })],
  })
  .addPortType({
    type: "question",
    name: "question",
    color: Colors.orange,
    hidePort: true,
    controls: [
      Controls.text({ label: "Frage", name: "question" }),
      Controls.text({ label: "Antwortmöglichkeiten", name: "answer" }),
    ],
  })
  .addNodeType({
    type: "dependent",
    label: "Abhängiger Frageknoten",
    inputs: (ports) => [
      ports.string({ label: "Input", noControls: true }),
      ports.comparison(),
      ports.question(),
    ],
    outputs: (ports) => [ports.string({ label: "Gewählte Antwort" })],
  })
  .addNodeType({
    type: "independent",
    label: "Unabhängiger Frageknoten",
    inputs: (ports) => [ports.question()],
    outputs: (ports) => [ports.string({ label: "Gewählte Antwort" })],
  })
  .addNodeType({
    type: "endnode",
    label: "Ergebnis",
    inputs: (ports) => [
      ports.string({ label: "Input", noControls: true }),
      ports.comparison(),
      ports.string({ hidePort: true, label: "Ergebnis", name: "result" }),
    ],
  });

export default config;
