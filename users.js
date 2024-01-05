export const users = [
  {
    id: "1",
    name: "Maxim",
    password: "12345",
    email: "maxim2208@gmail.com",
    entiries: 0,
    joined: new Date(),
  },
];

export const validateLogin = (email, password) => {
  const itExist = users.filter(
    (user) => user.email === email && user.password === password
  );

  if (itExist.length !== 0) {
    return true;
  }
  return false;
};

export const validateRegister = (email) => {
  if (users.filter((user) => user.email === email).length !== 0) {
    return false;
  }
  return true;
};
