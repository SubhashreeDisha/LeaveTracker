async function calculateLeaveDays(type, fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (to < from) return 0;

  let totalDays = 0;

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 0 || day === 6) continue; // Skip weekends

    totalDays++;
  }

  if (type === 'wfh') {
    // Calculate full weeks in range
    const diffInMs = to.getTime() - from.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    const fullWeeks = Math.floor(diffInDays / 7);
    const compulsoryWFH = fullWeeks * 2;

    totalDays -= compulsoryWFH;
    if (totalDays < 0) totalDays = 0;
  }

  return totalDays;
}


module.exports = calculateLeaveDays;
