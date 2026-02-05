// Save login details
export const loginUser = (token, role) => {
  if (!token || !role) return;

  localStorage.setItem("token", token);
  localStorage.setItem("role", role.toUpperCase()); // 🔥 normalize role
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
};
