export const validateRegister = (
  email: string,
  password: string,
  bio: string,
  firstName: string,
  lastName: string,
) => {
  if (!email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }
  if (password.length <= 6) {
    return [
      {
        field: 'password',
        message: 'password must be greater than 6 characters',
      },
    ];
  }
  if (!bio) {
    return [
      {
        field: 'bio',
        message: 'Bio is a required field',
      },
    ];
  }
  if (!firstName) {
    return [
      {
        field: 'firstName',
        message: 'First name is a required field',
      },
    ];
  }
  if (!lastName) {
    return [
      {
        field: 'lastName',
        message: 'Last name is a required field',
      },
    ];
  }

  return null;
};
