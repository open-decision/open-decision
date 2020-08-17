export default {
  "-IKUYfCE2J": {
    id: "-IKUYfCE2J",
    x: -633,
    y: -240,
    type: "entrypoint",
    width: 170,
    connections: {
      inputs: {},
      outputs: {
        answer: [
          {
            nodeId: "AQSsScPqyb",
            portName: "answer",
          },
        ],
      },
    },
    inputData: {
      introduction: {
        welcomeMessage: "",
        Erklärung: "",
      },
    },
    root: true,
  },
  AQSsScPqyb: {
    id: "AQSsScPqyb",
    x: -371,
    y: -88.5,
    type: "question",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "-IKUYfCE2J",
            portName: "answer",
          },
        ],
      },
      outputs: {
        answer: [
          {
            nodeId: "8eAI45Dm5o",
            portName: "answer",
          },
          {
            nodeId: "B8bvidI7py",
            portName: "answer",
          },
          {
            nodeId: "LPjDZg8C3f",
            portName: "answer",
          },
        ],
      },
    },
    inputData: {
      answer: {
        answer: "",
      },
      question: {
        Fragetext: "",
        Erklärung: "",
      },
    },
  },
  "8eAI45Dm5o": {
    id: "8eAI45Dm5o",
    x: -101,
    y: -107.5,
    type: "answer",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "AQSsScPqyb",
            portName: "answer",
          },
        ],
      },
      outputs: {
        answer: [
          {
            nodeId: "YAU8vtLM-6",
            portName: "answer",
          },
        ],
      },
    },
    inputData: {
      answer: {
        answer: "",
      },
    },
  },
  B8bvidI7py: {
    id: "B8bvidI7py",
    x: -102,
    y: 31.5,
    type: "answer",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "AQSsScPqyb",
            portName: "answer",
          },
        ],
      },
      outputs: {
        answer: [
          {
            nodeId: "pRTNueuGWC",
            portName: "answer",
          },
        ],
      },
    },
    inputData: {
      answer: {
        answer: "",
      },
    },
  },
  LPjDZg8C3f: {
    id: "LPjDZg8C3f",
    x: -107,
    y: 170.5,
    type: "answer",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "AQSsScPqyb",
            portName: "answer",
          },
        ],
      },
      outputs: {
        answer: [
          {
            nodeId: "jkDwhU95B3",
            portName: "answer",
          },
        ],
      },
    },
    inputData: {
      answer: {
        answer: "",
      },
    },
  },
  "YAU8vtLM-6": {
    id: "YAU8vtLM-6",
    x: 151,
    y: -350.5,
    type: "question",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "8eAI45Dm5o",
            portName: "answer",
          },
        ],
      },
      outputs: {
        answer: [
          {
            nodeId: "NQ-D2q4PU7",
            portName: "answer",
          },
        ],
      },
    },
    inputData: {
      answer: {
        answer: "",
      },
      question: {
        Fragetext: "",
        Erklärung: "",
      },
    },
  },
  pRTNueuGWC: {
    id: "pRTNueuGWC",
    x: 169,
    y: -54.5,
    type: "question",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "B8bvidI7py",
            portName: "answer",
          },
        ],
      },
      outputs: {
        answer: [
          {
            nodeId: "49xIJljVyd",
            portName: "answer",
          },
          {
            nodeId: "-A_D4IYn7g",
            portName: "answer",
          },
        ],
      },
    },
    inputData: {
      answer: {
        answer: "",
      },
      question: {
        Fragetext: "",
        Erklärung: "",
      },
    },
  },
  jkDwhU95B3: {
    id: "jkDwhU95B3",
    x: 121,
    y: 269.5,
    type: "question",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "LPjDZg8C3f",
            portName: "answer",
          },
        ],
      },
      outputs: {},
    },
    inputData: {
      answer: {
        answer: "",
      },
      question: {
        Fragetext: "",
        Erklärung: "",
      },
    },
  },
  "-A_D4IYn7g": {
    id: "-A_D4IYn7g",
    x: 444,
    y: 22.5,
    type: "answer",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "pRTNueuGWC",
            portName: "answer",
          },
        ],
      },
      outputs: {},
    },
    inputData: {
      answer: {
        answer: "",
      },
    },
  },
  "49xIJljVyd": {
    id: "49xIJljVyd",
    x: 443,
    y: -179.5,
    type: "answer",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "pRTNueuGWC",
            portName: "answer",
          },
        ],
      },
      outputs: {},
    },
    inputData: {
      answer: {
        answer: "",
      },
    },
  },
  "NQ-D2q4PU7": {
    id: "NQ-D2q4PU7",
    x: 402,
    y: -344.5,
    type: "answer",
    width: 140,
    connections: {
      inputs: {
        answer: [
          {
            nodeId: "YAU8vtLM-6",
            portName: "answer",
          },
        ],
      },
      outputs: {},
    },
    inputData: {
      answer: {
        answer: "",
      },
    },
  },
};
