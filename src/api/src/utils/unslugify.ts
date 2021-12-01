const unslugify = (slug: string): string => {
  const result = slug.replace(/-/g, ' ');
  return result.replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toLowerCase() + txt.substr(1).toLocaleLowerCase();
  });
};
export default unslugify;
