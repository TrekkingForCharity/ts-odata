export class FilterObj {
    filterObj: any;
    logicalOperator: any;

    constructor(filterObj: any, logicalOperator: any = null) {
        this.filterObj = filterObj;
        this.logicalOperator = null;
        if (logicalOperator !== undefined && logicalOperator !== null) {
            this.logicalOperator = logicalOperator;
        }
    }

    toString (i: any): string {
        let filter = '';
        if (this.logicalOperator !== null && i > 0) {
            filter += ' ' + this.logicalOperator + ' ';
        } else if (i > 0 && this.logicalOperator === null) {
            filter += ' and ';
        }

        filter += this.filterObj.toString();
        return filter;
    }
}
