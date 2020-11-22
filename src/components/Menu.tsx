import React from "react";
import { InternalLink } from "./InternalLink";
import { UserCircleOutline } from "@graywolfai/react-heroicons";
import { useKeyboardEvent } from "@utils/index";
import { Dropdown } from "./Dropdown";

type Link = { to: string; text: string };

type MenuProps = {
  icon?: string;
  alt?: string;
  className?: {
    menu?: string;
    dropdown?: string;
    menuIcon?: string;
  };
  links: {
    dropdownLinks: Link[];
    dropdownButtons: JSX.Element | JSX.Element[];
  };
};

export const Menu: React.FC<MenuProps> = ({
  icon = "",
  alt = "Anonymer User",
  className = {
    menu: "",
    dropdown: "",
    menuIcon: "",
  },
  links = {
    dropdownLinks: [],
    dropdownButtons: [],
  },
}) => {
  const [open, setOpen] = React.useState(false);
  useKeyboardEvent("Escape", () => setOpen(false));

  return (
    <div className={`flex items-center justify-end sm:space-x-6`}>
      <Dropdown
        icon={icon ? <img src={icon} alt={alt} /> : <UserCircleOutline />}
        open={open}
        setOpen={setOpen}
      >
        <div className="flex flex-col -m-3 mb-0 space-y-4">
          {links.dropdownLinks.map((link) => (
            <InternalLink to={link.to} key={link.to} className="menu-link">
              {link.text}
            </InternalLink>
          ))}
        </div>
        <div className="flex space-x-6 border-t-2 pt-3 mt-6 border-gray-400">
          {links.dropdownButtons}
        </div>
      </Dropdown>
    </div>
  );
};
