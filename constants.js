const current = new Date()
function isLeapYear() {
  const year = current.getFullYear()
  if (year % 4 !== 0) return false;
  if (year % 100 !== 0) return true;
  return year % 400 === 0;
}

export const MONTH_DATA = [
  { month: "January", days: 31 },
  { month: "February", days: isLeapYear() ? 29 : 28 },
  { month: "March", days: 31 },
  { month: "April", days: 30 },
  { month: "May", days: 31 },
  { month: "June", days: 30 },
  { month: "July", days: 31 },
  { month: "August", days: 31 },
  { month: "September", days: 30 },
  { month: "October", days: 31 },
  { month: "November", days: 30 },
  { month: "December", days: 31 },
];



