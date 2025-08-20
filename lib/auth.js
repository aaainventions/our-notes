let isLoggedIn = false;

export function login(email, password) {
  if (
    email === process.env.LOGIN_EMAIL &&
    password === process.env.LOGIN_PASSWORD
  ) {
    isLoggedIn = true;
    return true;
  }
  return false;
}

export function logout() {
  isLoggedIn = false;
}

export function checkAuth() {
  return isLoggedIn;
}
