import React from "react";
import { Comments, NodeEditor, Nodes } from "flume";
import config from "./config";
import { Button, FileInput, Link } from "@components/index";
import { ChevronRightOutline } from "@graywolfai/react-heroicons";

const Editor: React.FC<{
  initialData?: { nodes: Nodes; comments: Comments };
  setNodes?: any;
  setComments?: any;
}> = ({ initialData = { nodes: {}, comments: {} }, setNodes, setComments }) => (
  <NodeEditor
    portTypes={config.portTypes}
    nodeTypes={config.nodeTypes}
    nodes={initialData.nodes}
    onChange={setNodes}
    comments={initialData.comments}
    onCommentsChange={setComments}
  />
);

export const Builder = () => {
  const [data, setData] = React.useState<
    undefined | { nodes: Nodes; comments: Comments }
  >();
  let fileReader: FileReader;

  const handleFileRead = () => setData(JSON.parse(fileReader.result as string));

  const handleFileChosen = (file: File) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div className="relative" style={{ backgroundColor: "#1a1c1d" }}>
      {data?.nodes ? (
        <>
          <div className="absolute p-5 z-20 space-x-6 flex">
            <Link
              variant="button"
              download="decision_tree.json"
              href={`data:application/json,${JSON.stringify(data, null, "\t")}`}
            >
              Export
            </Link>

            <Button
              onClick={() => {
                setData(undefined);
              }}
            >
              Reset
            </Button>
          </div>
          <Editor
            initialData={data}
            setNodes={(value: Nodes) => setData({ ...data, nodes: value })}
            setComments={(value: Comments) =>
              setData({ ...data, comments: value })
            }
          />
        </>
      ) : (
        <div className="text-white h-full w-full flex justify-center items-center flex-col">
          <div>
            <h1 className="text-5xl">Starte mit Testen!</h1>
            <p className="mt-6 text-xl">
              Um den Builder auszuprobieren klicke auf{" "}
              <Button
                onClick={() => setData({ nodes: {}, comments: {} })}
                className="mx-2"
              >
                <ChevronRightOutline className="w-6" />
                Starten
              </Button>
            </p>
            <p className="text-lg mt-12">
              Alternativ kann ein bestehender Datensatz importiert werden.
              <FileInput
                className="mt-4"
                name="file"
                accept=".json"
                onChange={(e) =>
                  e?.currentTarget?.files &&
                  handleFileChosen(e.currentTarget.files[0])
                }
              >
                Datei hochladen
              </FileInput>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
