import { loginPattern, passwordComplexity } from '~/constants/regex';

export const validateLoginData = (login: string, password: string): boolean => {
  if (!loginPattern.test(login)) {
    return false;
  }

  return validatePassword(password);
};

export const validatePassword = (newPassword: string): boolean => {
  return passwordComplexity.test(newPassword);
};
