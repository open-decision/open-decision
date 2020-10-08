export type Tag = {
  name: string;
  color: string;
};
export type Tree = {
  name: string;
  tags: Tag[];
  createdAt: string;
  id: string;
};
