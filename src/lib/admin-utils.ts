export const toDate = (date: string | Date) => {
  const day = new Date(date).toDateString();
  const time = new Date(date).toLocaleTimeString();

  return `${day} ${time}`;
};
