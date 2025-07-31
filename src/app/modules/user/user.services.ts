import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email, phone, role } = payload;

  const user = await User.create({ name, email, phone, role });

  return user;
};

const getAllUsers = async () => {};

export const UserService = {
  createUser,
  getAllUsers,
};
