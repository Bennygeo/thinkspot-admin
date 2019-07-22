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
}
