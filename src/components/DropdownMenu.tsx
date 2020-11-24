import React from "react";
import { useKeyboardEvent } from "@utils/index";
import { Button } from "./Button";

type MenuProps = {
  icon?: React.ReactNode;
  alt?: string;
};

export const DropdownMenu: React.FC<MenuProps> = ({ icon = "", children }) => {
  const [open, setOpen] = React.useState(false);
  useKeyboardEvent("Escape", () => setOpen(false));

  return (
    <div className="flex items-center justify-end sm:space-x-6">
      <Dropdown icon={icon} open={open} setOpen={setOpen}>
        <div className="flex flex-col -m-3 mb-0 space-y-4">{children}</div>
      </Dropdown>
    </div>
  );
};

type Dropdown = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  icon: React.ReactNode;
};

const Dropdown: React.FunctionComponent<Dropdown> = ({
  children,
  open,
  setOpen,
  icon,
}) => {
  useKeyboardEvent("Escape", () => setOpen(false));

  return (
    <div className="relative">
      <Button
        size="filled"
        kind="icon"
        onClick={() => setOpen(!open)}
        className="relative z-10"
      >
        {icon}
      </Button>
      {open ? (
        <>
          <button
            onClick={() => setOpen(false)}
            className="fixed inset-0 w-full h-full bg-black opacity-10 cursor-default z-1"
            tabIndex={-1}
          />
          <div className={`origin-top-right absolute right-0 mt-8 shadow-lg`}>
            <div className="relative z-10 px-8 py-6 rounded-sm bg-gray-100">
              {children}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
