export const getLastTransactionDate = (): Date | null => {
  const date = localStorage.getItem("lastTransactionDate");
  return date ? new Date(date) : null;
};

export const setLastTransactionDate = (date: Date) => {
  localStorage.setItem("lastTransactionDate", date.toISOString());
};

export const getEndOfDayStatus = (): boolean => {
  return JSON.parse(localStorage.getItem("endOfDayStatus") || "false");
};

export const setEndOfDayStatus = (status: boolean) => {
  localStorage.setItem("endOfDayStatus", JSON.stringify(status));
};
