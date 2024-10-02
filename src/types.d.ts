export type RegisterInputs = {
  username: string;
  email: string;
  password: string;
};

export type LoginInputs = {
  email: string;
  password: string;
};

export type UserData = {
  username: string;
  email: string;
  id: string;
  profilePic: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
};
