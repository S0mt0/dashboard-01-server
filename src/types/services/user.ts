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
  avatar?: Avatar;
};

export type TPasswordResetPayload = {
  newPassword: string;
  confirmPassword: string;
};
