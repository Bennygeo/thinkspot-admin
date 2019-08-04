export class DateUtils extends Date {
    constructor() {
        super();
    }

    addDays(date, days): Date {
        date.setDate(date.getDate() + parseInt(days));
        return date;
    }

    getDateString(date, divider): string {
        let day = date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate();
        let mnth = ((date.getMonth() + 1).toString()).length == 1 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();

        return day + divider + (mnth) + divider + date.getFullYear();
    }

    dateFormater(dateString, divider) {
        let str = dateString.split('-');
        // console.log("str :: " + str.length);
        if (str.length > 1)
            return str.join('');
        else
            return dateString.slice(0, 2) + divider + dateString.slice(2, 4) + divider + dateString.slice(4);
    }

    stdDateFormater(date: string) {
        let data = date.split('-');
        return data[1] + '/' + data[0] + '/' + data[2];
    }

    dateDiff(date1, date2): number {
        let timeDiff = date1.getTime() - date2.getTime();
        return timeDiff / (1000 * 3600 * 24);
    }

    
}
