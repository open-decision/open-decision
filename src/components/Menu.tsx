import React from "react";
import { IconButton } from "./IconButton";
import { InternalLink } from "./InternalLink";
import { UserCircleOutline } from "@graywolfai/react-heroicons";
import { useKeyboardEvent } from "@utils/index";

type Link = { to: string; text: string };

type UserMenu = {
  icon?: string;
  alt?: string;
  className?: {
    menu?: string;
    dropdown?: string;
    menuIcon?: string;
  };
  links: {
    dropdownLinks?: Link[];
    dropdownButtons?: JSX.Element | JSX.Element[];
  };
};

export const Menu: React.FC<UserMenu> = ({
  icon,
  alt = "Anonymer User",
  className = { menu: "", dropdown: "", menuIcon: "" },
  links,
}) => {
  const [open, setOpen] = React.useState(false);
  useKeyboardEvent("Escape", () => setOpen(false));

  return (
    <div className={`flex items-center justify-end sm:space-x-6`}>
      <div className="relative">
        <IconButton
          onClick={() => setOpen(!open)}
          className={`relative z-10 ${className.menuIcon}`}
        >
          {icon ? <img src={icon} alt={alt} /> : <UserCircleOutline />}
        </IconButton>

        {open ? (
          <>
            {/* Backdrop to close the Menu on click outside */}
            <button
              onClick={() => setOpen(false)}
              className="fixed inset-0 w-full h-full bg-black opacity-25 cursor-default z-10"
              tabIndex={-1}
            />
            <Dropdown className={`relative z-10 ${className.dropdown}`}>
              <div className="flex flex-col -m-3 mb-0 space-y-4">
                {links.dropdownLinks.map((link) => (
                  <InternalLink
                    to={link.to}
                    key={link.to}
                    className="menu-link"
                  >
                    {link.text}
                  </InternalLink>
                ))}
              </div>
              <div className="flex space-x-6 border-t-2 pt-3 mt-6 border-gray-400">
                {links.dropdownButtons}
              </div>
            </Dropdown>
          </>
        ) : null}
      </div>
    </div>
  );
};

type Dropdown = {
  className?: string;
};

export const Dropdown: React.FC<Dropdown> = ({ className = "", children }) => {
  return (
    <div className={`origin-top-right absolute right-0 mt-4 shadow-lg`}>
      <div className={`px-8 py-6 rounded-md bg-gray-200 ${className}`}>
        {children}
      </div>
    </div>
  );
};
