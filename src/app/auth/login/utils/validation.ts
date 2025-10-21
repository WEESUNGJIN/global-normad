export function isValidEmail(email: string): boolean {
  const effective = /^[^\s@]+@[^\s@]+\.(com|co.kr)$/i;
  return effective.test(email);
}

export function isValidLogin(email: string, password: string): boolean {
  return isValidEmail(email) && password.trim().length >= 8;
}
