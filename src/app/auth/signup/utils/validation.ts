// src/app/auth/signup/utils/validation.ts

export function isValidEmail(email: string): boolean {
  const effective = /^[^\s@]+@[^\s@]+\.(com|co.kr)$/i;
  return effective.test(email);
}

export function isValidSignup(
  email: string,
  nickname: string,
  password: string,
  checkPassword: string,
): boolean {
  return (
    isValidEmail(email) &&
    nickname.trim() !== "" &&
    password.trim().length >= 8 &&
    password === checkPassword
  );
}
