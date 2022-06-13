import { Error } from "./Types";

const validEmail = (em: string) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    em
  );

export const validateEmail = (email: string): Error[] => {
  const validationErrors: Error[] = [];
  if (email.length === 0) {
    validationErrors.push({
      type: "email",
      message: "You need to enter a email address",
    });
  } else if (!validEmail(email)) {
    validationErrors.push({
      type: "email",
      message: "Invalid email address",
    });
  }

  return validationErrors;
};

export const validatePassword = (
  password: string,
  confirmPassword?: string
): Error[] => {
  const validationErrors: Error[] = [];
  if (password.length === 0) {
    validationErrors.push({
      type: "password",
      message: "You need to enter a password",
    });
  } else if (password.length < 6) {
    validationErrors.push({
      type: "password",
      message: "The password needs to be at least 6 characters",
    });
  }

  if (confirmPassword !== undefined) {
    if (confirmPassword.length === 0) {
      validationErrors.push({
        type: "confirmPassword",
        message: "You need to enter a password",
      });
    } else if (confirmPassword.length < 6) {
      validationErrors.push({
        type: "confirmPassword",
        message: "The password needs to be at least 6 characters",
      });
    } else if (password !== confirmPassword) {
      validationErrors.push({
        type: "confirmPassword",
        message: "The passwords must be equal",
      });
    }
  }
  return validationErrors;
};

export const validateName = (name: string): Error[] => {
  const validationErrors: Error[] = [];
  if (name.length === 0) {
    validationErrors.push({
      type: "name",
      message: "You need to enter a name",
    });
  }
  return validationErrors;
};

export const validateAPIKey = (APIKey: string): Error[] => {
  const validationErrors: Error[] = [];
  if (APIKey.length === 0) {
    validationErrors.push({
      type: "APIKey",
      message: "You need to provide a valid API key",
    });
  }
  return validationErrors;
};

export const validateAPISecret = (APISecret: string): Error[] => {
  const validationErrors: Error[] = [];
  if (APISecret.length === 0) {
    validationErrors.push({
      type: "APISecret",
      message: "You need to provide a valid API secret key",
    });
  }
  return validationErrors;
};

export const validateExchange = (APISecret: string): Error[] => {
  const validationErrors: Error[] = [];
  if (APISecret.length === 0) {
    validationErrors.push({
      type: "Exchange",
      message: "You need to enter a Exchange",
    });
  }
  return validationErrors;
};
