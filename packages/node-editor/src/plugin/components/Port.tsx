export const portWidth = 18;

export const portClasses =
  "bg-gray1 border border-gray7 [&[data-connecting=true][data-connectable=false]]:cursor-not-allowed";
export const targetPortClasses = `${portClasses} opacity-0 [&[data-connecting=true][data-connectingnode=false][data-connectable=false]]:border-primary9 [&[data-connecting=true][data-connectingnode=false][data-connectable=false]]:shadow-2`;
export const sourcePortClasses = `${portClasses} [&[data-active=true]]:shadow-2 [&[data-active=true]]:border-primary9 hover:border-primary9`;
