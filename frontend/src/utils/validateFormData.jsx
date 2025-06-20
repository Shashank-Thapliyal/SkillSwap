export const signupValidation = (data) => {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.firstName.trim()) {
    errors.push("First name is required.");
  }

  if (!data.email.trim() || !emailRegex.test(data.email)) {
    errors.push("A valid email is required.");
  }

  if (data.password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  return errors;
};
