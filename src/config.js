import { FlumeConfig, Colors, Controls } from "flume";

const config = new FlumeConfig();

config
  .addPortType({
    type: "connection",
    name: "connection",
    label: "Dynamic",
    color: Colors.green,
  })
  .addPortType({
    type: "question",
    name: "question",
    label: "Frage",
    hidePort: true,
    controls: [
      Controls.text({
        name: "Fragetext",
        label: "Fragetext",
        placeholder:
          "Tragen Sie hier die Frage ein die vom Nutzer beantwortet werden soll.",
      }),
      Controls.text({
        name: "Erklärung",
        label: "Erklärung",
        placeholder:
          "Wenn Sie möchten können Sie hier eine Erklärung zur Frage hinzufügen.",
      }),
    ],
  })
  .addPortType({
    type: "introduction",
    name: "introduction",
    label: "Einführung",
    hidePort: true,
    controls: [
      Controls.text({
        name: "welcomeMessage",
        label: "Willkommensnachricht",
        placeholder:
          "Hier können Sie den Nutzer des Entscheidungsbaumes begrüßen.",
      }),
      Controls.text({
        name: "Erklärung",
        label: "Erklärung",
        placeholder:
          "Wenn Sie möchten können Sie die Funktion des Baumes erklären.",
      }),
    ],
  })
  .addNodeType({
    type: "string",
    label: "Frage",
    description: "Stellen Sie eine Frage and den Nutzer.",
    initialWidth: 140,
    inputs: (ports) => [
      ports.connection({ label: "Nächste Frage" }),
      ports.question(),
    ],
    outputs: (ports) => [ports.connection()],
  })
  .addRootNodeType({
    type: "entrypoint",
    label: "Startpunkt",
    initialWidth: 170,
    inputs: (ports) => [ports.introduction()],
    outputs: (ports) => [
      ports.connection({
        label: "Erste Frage",
      }),
    ],
  });

export default config;
