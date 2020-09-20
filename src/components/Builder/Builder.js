import React from "react";
import {
  fetchDatabase,
  SINGLE_TREE,
  getSingleTreeData,
} from "../../backend-integration";
import { Flex } from "theme-ui";
import { NodeEditor, useRootEngine } from "flume";
import config from "./config";
import engine from "./engine";

export const Builder = () => {
  const [nodes, setNodes] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      setNodes(
        await fetchDatabase({
          query: SINGLE_TREE,
          dataAccessor: getSingleTreeData,
        })
      );
    };
    fetchData();
  }, []);

  return (
    <Flex sx={{ alignItems: "start", flexWrap: "wrap" }}>
      <NodeEditor
        portTypes={config.portTypes}
        nodeTypes={config.nodeTypes}
        defaultNodes={[
          {
            type: "homepage",
            x: 190,
            y: -150,
          },
        ]}
      />
    </Flex>
  );
};

const fakeUser = {
  firstName: "Bustopher",
  lastName: "Jones",
  isLoggedIn: true,
  isAdmin: true,
  year: 2020,
};

const nullUser = {
  firstName: "",
  lastName: "",
  isLoggedIn: false,
  isAdmin: false,
  year: 2020,
};

export const Homepage = ({ nodes }) => {
  const [user, setUser] = React.useState(fakeUser);
  const { answer, description } = useRootEngine(nodes, engine, { user });

  const login = () => setUser(fakeUser);
  const logout = () => setUser(nullUser);

  return (
    <div>
      <h1 sx={{ fontSize: "30px" }}>{answer}</h1>
      <p sx={{ fontSize: "30px" }}>{description}</p>
    </div>
  );
};
