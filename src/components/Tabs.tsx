import clsx from "clsx";
import React from "react";

type Tabs = {
  tabs: { component: React.FunctionComponent; label: string }[];
  initialActive: string;
  className?: string;
};

export const Tabs: React.FunctionComponent<Tabs> = ({
  tabs,
  initialActive,
  className,
}) => {
  const [active, setActive] = React.useState(initialActive);

  return (
    <div>
      <div className={clsx(className, "flex justify-around")}>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={clsx(
              "flex-grow flex-basis-0 p-4 border-b-2 hover:bg-green-200 focus:bg-green-100 focus:outline-none",
              { ["border-green-500 bg-green-50"]: active === tab.label }
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
