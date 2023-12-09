import { CustomRequest, ServiceResponse } from "../../types";
import { IUser } from "../../sdk/database/mongodb/types/user";
import { UserLib } from "../../sdk/database/mongodb/config";

export const signUp = async (
  payload: IUser,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const user = await UserLib.addDoc(payload);
  console.log(user.schema.methods.createJWT());

  return { data: user, message: "Sign up successful" };
};
