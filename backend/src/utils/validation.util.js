export const validateUser = ({ name, email, password, address }) => {
  if (!name || name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (address && address.length > 400) {
    return "Address cannot exceed 400 characters";
  }
  const passRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,16}$/;
  if (!passRegex.test(password)) {
    return "Password must be 8–16 chars, include 1 uppercase & 1 special character";
  }
  return null;
};
