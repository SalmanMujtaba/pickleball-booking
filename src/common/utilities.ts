export const getNextTuesday = (): Date => {
  const today = new Date();
  const nextTuesday = new Date();
  nextTuesday.setDate(today.getDate() + ((2 - today.getDay() + 7) % 7));
  if (nextTuesday <= today) {
    nextTuesday.setDate(nextTuesday.getDate() + 7);
  }
  return nextTuesday;
};

export const formatCourtNumbers = (courts: number): string => {
  if (courts === 0) return "No courts booked";
  if (courts === 1) return "Court 1";

  const courtNumbers = Array.from({ length: courts }, (_, i) => i + 1);
  if (courts <= 3) {
    return `Courts ${courtNumbers.join(", ")}`;
  }
  return `Courts 1-${courts}`;
};