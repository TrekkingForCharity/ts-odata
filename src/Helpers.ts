export class Helpers {
    public static formatValue (value: any): any {
        if (value.length > 8 && value.substring(0, 8) === 'datetime') {
            return value;
        }

        if (value.length > 4 && value.substring(0, 4) === 'guid') {
            return value;
        }

        if (value.length > 4 && value.substring(0, 4) === 'v4guid') {
            return value.slice(-6);
        }

        if (typeof value === 'string') {
            let numberSuffixes = ['m', 'f', 'd'];
            for (let i = 0; i < numberSuffixes.length; i++) {
                let suffix = numberSuffixes[i];
                if (value.indexOf(suffix, (<any>value).length - (<any>suffix).length) !== -1) {
                    let numberValue = value.substring(0, (<any>value).length - 1);
                    if (!isNaN(<any>numberValue)) {
                        return value;
                    }
                }
            }

            return '\'' + value + '\'';
        }

        return value;
    }
    public static addLogicalOperator (value: any, operator: any, filterClause: any): any {
        filterClause.value = value;
        filterClause.isClauseEmpty = false;

        filterClause.components.push(operator + ' ' + this.formatValue(value));

        return filterClause;
    }
    public static addArithmeticOperator (amount: any, operator: any, filterClause: any): any {
        filterClause.components.push(operator + ' ' + amount);
        return filterClause;
    }
    public static addMethodWrapper (filterClause: any, func: any): any {
        filterClause.propertyIncluded = true;
        filterClause.funcReturnType = Number();
        let that = filterClause;
        filterClause.components.push(func + '(' + that.property + ')');

        return filterClause;
    }
}
