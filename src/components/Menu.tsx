import React from "react";
import { IconButton } from "./IconButton";
import { InternalLink } from "./InternalLink";

const AnonymousUserIcon = new URL(
  "/assets/icons/account_circle.svg",
  import.meta.url
);

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
    menuLinks: Link[];
    dropdownLinks?: Link[];
    dropdownButtons?: JSX.Element | JSX.Element[];
    buttons?: JSX.Element | JSX.Element[];
  };
};

export const Menu: React.FC<UserMenu> = ({
  icon = AnonymousUserIcon.href,
  alt = "Anonymer User",
  className = { menu: "", dropdown: "", menuIcon: "" },
  links,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={`flex items-center justify-end sm:space-x-6`}>
      <div className={`space-x-8 hidden md:flex ${className.menu}`}>
        {links.menuLinks.map((link) => (
          <InternalLink to={link.to} key={link.to} className="menu-link">
            {link.text}
          </InternalLink>
        ))}
      </div>

      <div className="relative">
        <IconButton
          icon={icon}
          alt={alt}
          onClick={() => setOpen(!open)}
          className={`${className.menuIcon}`}
        />

        {open ? (
          <Dropdown className={`${className.dropdown}`}>
            <div className="flex flex-col -m-3 mb-0">
              {links.menuLinks.map((link) => (
                <InternalLink
                  to={link.to}
                  key={link.to}
                  className="md:hidden menu-link"
                >
                  {link.text}
                </InternalLink>
              ))}

              {links.dropdownLinks.map((link) => (
                <InternalLink to={link.to} key={link.to} className="menu-link">
                  {link.text}
                </InternalLink>
              ))}
            </div>

            <div className="flex space-x-6 border-t-2 pt-3 mt-8 border-gray-400">
              {links.dropdownButtons}
            </div>
          </Dropdown>
        ) : null}
      </div>
      <div className="flex space-x-6">{links.buttons}</div>
    </div>
  );
};

type Dropdown = {
  className?: string;
};

export const Dropdown: React.FC<Dropdown> = ({ className = "", children }) => {
  return (
    <div className={`origin-top-right absolute right-0 mt-4 shadow-lg`}>
      <div
        className={`px-8 py-6 space-y-4 rounded-md bg-gray-200 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
