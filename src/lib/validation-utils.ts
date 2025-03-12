export const isEmailOrPhone = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{1,14}$/; // E.164 format for phone numbers
  return emailRegex.test(value) || phoneRegex.test(value);
};

export const isPhone = (value: string) => {
  const phoneRegex = /^\+?\d{1,14}$/; // E.164 format for phone numbers
  return phoneRegex.test(value);
};

export const isOldEnough = (date: string) => {
  const nearestDate = new Date(); // Set your minimum date here
  nearestDate.setFullYear(nearestDate.getFullYear() - 5); //min age is 5 years old
  return new Date(date) < nearestDate;
};
