export type User = {
  name: string;
  id: string;
};

export type Room = {
  id: string;
  title: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
};
