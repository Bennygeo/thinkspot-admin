export class DateUtils extends Date {
    constructor() {
        super();
    }

    addDays(days): Date {
        this.setDate(this.getDate() + parseInt(days));
        return this
    }
}
