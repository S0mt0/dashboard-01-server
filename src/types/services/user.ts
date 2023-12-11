export type TProfileUpdateRequestPayload = {
  username?: string;
  email?: string;
  avatar?: Record<string, any>;
};

export type TPasswordResetPayload = {
  newPassword: string;
  confirmPassword: string;
};
