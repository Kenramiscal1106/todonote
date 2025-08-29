/**
 *
 * @param {string} date
 */
export function isWithinDay(date) {
  let within = true;
  const dateObj = new Date(date);
  const current = new Date();
  /**
   *
   * @param {Date} dateObj
   */
  function convertInfo(dateObj) {
    return {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth(),
      date: dateObj.getDate(),
    };
  }
  const dateInfo = convertInfo(dateObj);
  const currentInfo = convertInfo(current)
  Object.keys(dateInfo).forEach((key) => {
    if (currentInfo[key] !== dateInfo[key]) {
      within = false;
    }
  });
  return within;

}