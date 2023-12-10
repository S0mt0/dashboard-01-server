export type TProfileUpdateRequestPayload = {
  username?: string;
  email?: string;
  avatar?: string;
};

export type TPasswordResetPayload = {
  newPassword: string;
  confirmPassword: string;
};
