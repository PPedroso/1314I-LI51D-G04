function getCurrentDate() {
    var currentDate = new Date();
    var day = currentDate.getDate() > 10 ? currentDate.getDate() : '0' + currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    month = month > 10 ? month : '0' + month;
    return day + '-' + month + '-' + currentDate.getFullYear();
}

module.exports = {
    getCurrentDate: getCurrentDate
}

