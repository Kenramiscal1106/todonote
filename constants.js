const current = new Date()
function isLeapYear() {
  const year = current.getFullYear()
  if (year % 4 !== 0) return false;
  if (year % 100 !== 0) return true;
  return year % 400 === 0;
}

export const MONTH_DATA = [
  { month: "January", date: 31 },
  { month: "February", date: isLeapYear() ? 29 : 28 },
  { month: "March", date: 31 },
  { month: "April", date: 30 },
  { month: "May", date: 31 },
  { month: "June", date: 30 },
  { month: "July", date: 31 },
  { month: "August", date: 31 },
  { month: "September", date: 30 },
  { month: "October", date: 31 },
  { month: "November", date: 30 },
  { month: "December", date: 31 },
];

export const DAYS = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

