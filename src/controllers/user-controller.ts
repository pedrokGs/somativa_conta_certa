import User, { IUser } from "@/models/user";
import connectMongo from "@/services/mongodb";
export const getUsers = async () => {
  await connectMongo();
  const users = await User.find({});
  return users;
};

export const getUserById = async (id: string) => {
  await connectMongo();
  const user = await User.findById(id);
  return user;
};

export const createUser = async (data: Partial<IUser>) => {
  await connectMongo();
  const novoUser = new User(data);
  await novoUser.save();
  return novoUser;
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  await connectMongo();
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  return user;
};

export const deleteUser = async (id: string) => {
  await connectMongo();
  await User.findByIdAndDelete(id);
};

export const authenticateUser = async (email: string, password: string) => {
    await connectMongo();
    const user = await User.find({email}).select("+password");

    if(!user || user.length === 0) return null;

    const senhaSecreta = await user[0].comparePassword(password);

    if(!senhaSecreta) return null;

    return user[0];
}