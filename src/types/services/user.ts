interface Avatar {
  fieldName?: string;
  originalFilename?: string;
  path?: string;
  headers?: {
    "content-disposition"?: string;
    "content-type"?: "image/jpeg" | "image/jpg" | "image/gif" | "image/png";
  };
  size?: number;
  name?: string;
  type?: "image/jpeg" | "image/jpg" | "image/gif" | "image/png";

  [key: string]: any;
}

export type TProfileUpdateRequestPayload = {
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  avatar?: Avatar;
};

export type TSignUpPayload = {
  username?: string;
  email?: string;
  password: string;
};

export type TPasswordResetRequestPayload = {
  email: string;
};

export type TPasswordResetPayload = {
  newPassword: string;
  confirmPassword: string;
};

export type TResetTokenPayload = {
  otp: string | number;
};

export type TSignInPayload = {
  email: string;
  password: string;
};
