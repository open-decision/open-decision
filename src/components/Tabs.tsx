import { Component } from "@internalTypes/global";
import clsx from "clsx";
import React from "react";

type Tabs = {
  tabs: { component: Component; label: string }[];
  initialActive: string;
};

export const Tabs: Component<Tabs> = ({ tabs, initialActive, className }) => {
  const [active, setActive] = React.useState(initialActive);

  return (
    <div>
      <div className={clsx(className, "flex justify-around")}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={clsx(
              "flex-grow flex-basis-0 p-4 border-b-2 hover:bg-primary-200 focus:bg-primary-100 focus:outline-none",
              { ["border-primary-500 bg-primary-50"]: active === tab.label }
            )}
            onClick={(e) => setActive(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs
        .filter((tab) => tab.label === active)
        .map((tab) => (
          <tab.component key={tab.label} />
        ))}
    </div>
  );
};
