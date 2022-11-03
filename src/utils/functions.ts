// Function that will take a string and return the first 20 characters of it
export const truncateString = (str: string, len: number) => {
  return str.length > len ? str.substring(0, len) : str;
};

// Function that will take a string or number and return a sanitized version of it (removing special characters)
export const sanitizeString = (str: string | number) => {
  if (typeof str === "number") return str;
  return str.toString().replace(/[^a-zA-Z0-9 ]/g, "");
};
