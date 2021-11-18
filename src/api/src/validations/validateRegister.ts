export const validateRegister = (options: {
  email: string;
  password: string;
  bio: string;
  firstName: string;
  lastName: string;
}) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }
  if (options.password.length <= 6) {
    return [
      {
        field: 'password',
        message: 'password must be greater than 6 characters',
      },
    ];
  }
  if (!options.bio) {
    return [
      {
        field: 'bio',
        message: 'Bio is a required field',
      },
    ];
  }
  if (!options.firstName) {
    return [
      {
        field: 'firstName',
        message: 'First name is a required field',
      },
    ];
  }
  if (!options.lastName) {
    return [
      {
        field: 'lastName',
        message: 'Last name is a required field',
      },
    ];
  }

  return null;
};
