import { loginPattern, passwordComplexity } from "~/constants/regex";

export const validateLoginData = (login: string, password: string): boolean => {
  if (!loginPattern.test(login)) {
    return false;
  }

  if (!passwordComplexity.test(password)) {
    return false;
  }

  return true;
};
