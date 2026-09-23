export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email);
}

export function isValidUsername(username: string) {
  return USERNAME_REGEX.test(username);
}

export function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function isPasswordValid(password: string) {
  const checks = getPasswordChecks(password);
  return checks.length && checks.uppercase && checks.number && checks.special;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Email sau parolă incorectă.",
  "User already registered": "Există deja un cont cu acest email.",
  "Email not confirmed": "Emailul nu a fost confirmat încă. Verifică-ți inboxul.",
};

export function translateAuthError(message: string) {
  return AUTH_ERROR_MESSAGES[message] ?? message;
}
