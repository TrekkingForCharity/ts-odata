export class Concat {
    constructor(public leftSide: string|Concat, public rightSide: string|Concat) {
    }


    toString(): string {
        return 'concat(' + this.writeValue(this.leftSide) + ',' + this.writeValue(this.rightSide) + ')';
    }

    private writeValue(value: any) {
        if (typeof value === 'object') {
            return value.toString();
        }
        if (typeof value === 'function') {
            return value.call(this);
        }
        return value.toString();
    }
}
