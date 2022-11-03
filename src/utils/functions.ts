// Function that will take a string and return the first 20 characters of it
export const truncateString = (str: string, len: number) => {
  return str.length > len ? str.substring(0, len) : str;
};
