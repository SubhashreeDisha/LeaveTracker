function getDateDifferenceInDays(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffInMs = toDate - fromDate;
    const days = Math.ceil(diffInMs / msPerDay);
    return days;
}
module.exports = { getDateDifferenceInDays }