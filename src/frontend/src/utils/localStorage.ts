export const setItem = (key: string, value: unknown) => {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: string) => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
};

export const delItem = (key: string) => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.removeItem(key);
};
