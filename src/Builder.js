import React from "react";
import { useParams } from "react-router-dom";

export const Builder = () => {
  let { treeId } = useParams();

  return <div>{treeId}</div>;
};
