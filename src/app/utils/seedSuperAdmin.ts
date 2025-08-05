import { env } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdmin = await User.findOne({ email: env.SUPER_ADMIN_EMAIL });

    if (isSuperAdmin) {
      console.log("Super Admin already Exists!!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      env.SUPER_ADIN_PASSWORD,
      Number(env.SALT)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: env.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);

    if (superAdmin) {
      console.log("Super Admin Created");
    }
  } catch (error) {
    console.log("super error", error);
  }
};
