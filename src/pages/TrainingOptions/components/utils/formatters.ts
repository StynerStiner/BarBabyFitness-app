export const formatPhoneNumber = (number: string) => {
  return number.replace(/\D/g, "").slice(0, 10);
};
