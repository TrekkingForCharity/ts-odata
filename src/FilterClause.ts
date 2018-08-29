import {Helpers} from './Helpers';
import {Concat} from './Concat';
export class FilterClause {

    components: string[];
    isClauseEmpty = true;
    propertyIncluded = false;
    usingNot = false;
    value: any;
    funcReturnType: any;
    transformFunc: Function | undefined;


    constructor(public property: string | null = null) {
        this.components = [];
    }

    toString(): string {
        let strComps: any, i: any, filterStr: any;
        strComps = [];

        if (!this.propertyIncluded) {
            strComps.push(this.property);
        }

        for (i = 0; i < this.components.length; i++) {
            strComps.push(this.components[i]);
        }
        filterStr = strComps.join(' ');

        if (!this.usingNot) {
            return filterStr;
        }

        return typeof this.funcReturnType === 'boolean' ? 'not ' + filterStr : 'not (' + filterStr + ')';
    }

    isEmpty(): Boolean {
        return this.isClauseEmpty || (this.propertyIncluded && this.usingNot);
    }

    // Logical operators
    eq(value: string|number|boolean): FilterClause {
        return Helpers.addLogicalOperator(value, 'eq', this);
    }

    ne(value: string|number|boolean): FilterClause {
        return Helpers.addLogicalOperator(value, 'ne', this);
    }

    gt(value: string|number|boolean): FilterClause {
        return Helpers.addLogicalOperator(value, 'gt', this);
    }

    ge(value: string|number|boolean): FilterClause {
        return Helpers.addLogicalOperator(value, 'ge', this);
    }

    lt(value: string|number|boolean): FilterClause {
        return Helpers.addLogicalOperator(value, 'lt', this);
    }

    le(value: string|number|boolean): FilterClause {
        return Helpers.addLogicalOperator(value, 'le', this);
    }

    not(): FilterClause {
        this.usingNot = true;
        return this;
    }

    // Arithmetic methods
    add(amount: number): FilterClause {
        return Helpers.addArithmeticOperator(amount, 'add', this);
    }

    sub(amount: number): FilterClause {
        return Helpers.addArithmeticOperator(amount, 'sub', this);
    }

    mul(amount: number): FilterClause {
        return Helpers.addArithmeticOperator(amount, 'mul', this);
    }

    div(amount: number): FilterClause {
        return Helpers.addArithmeticOperator(amount, 'div', this);
    }

    mod(amount: number): FilterClause {
        return Helpers.addArithmeticOperator(amount, 'mod', this);
    }

    // String functions
    substringof(value: string): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = Boolean();

        let property = this.property;
        if (this.transformFunc !== null) {
            property = this.components[this.components.length - 1];
            this.components.splice(this.components.length - 1, 1);
        }

        if (property) {
          this.components.push('substringof(\'' + value + '\',' + property + ')');
        } else {
          this.components.push('substringof(\'' + value + '\',' + this.property + ')');
        }


        return this;
    }

    substring(position: number, length?: number): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = String();

        let comps = [this.property, position];
        if (length !== undefined) {
            comps.push(length);
        }

        this.components.push('substring(' + comps.join(',') + ')');

        return this;
    }

    toLower(): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        let that = this;

        this.transformFunc = this.toLower;
        this.components.push('tolower(' + that.property + ')');

        return this;
    }

    toUpper(): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        let that = this;

        this.transformFunc = this.toUpper;
        this.components.push('toupper(' + that.property + ')');

        return this;
    }

    trim(): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = String();

        this.transformFunc = this.trim;
        this.components.push('trim(' + this.property + ')');

        return this;
    }

    endswith(value: string): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = Boolean();
        let that = this;
        this.components.push('endswith(' + that.property + ',\'' + value + '\')');

        return this;
    }

    startswith(value: string): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = Boolean();
        let that = this;
        this.components.push('startswith(' + that.property + ',\'' + value + '\')');

        return this;
    }

    length(): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = Number();
        let that = this;
        this.components.push('length(' + that.property + ')');

        return this;
    }

    indexof(value: string): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = Number();
        let that = this;
        this.components.push('indexof(' + that.property + ',\'' + value + '\')');

        return this;
    }

    replace(find: string, replace: string): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        let that = this;
        this.components.push('replace(' + that.property + ',\'' + find + '\',\'' + replace + '\')');

        return this;
    }

    // Concat
    Concat(concat: Concat): FilterClause {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        let that = this;
        that.components.push(concat.toString());

        return this;
    }

    // Date functions
    day(): FilterClause {
        return Helpers.addMethodWrapper(this, 'day');
    }

    hour(): FilterClause {
        return Helpers.addMethodWrapper(this, 'hour');
    }

    minute(): FilterClause {
        return Helpers.addMethodWrapper(this, 'minute');
    }

    month(): FilterClause {
        return Helpers.addMethodWrapper(this, 'month');
    }

    second(): FilterClause {
        return Helpers.addMethodWrapper(this, 'second');
    }

    year(): FilterClause {
        return Helpers.addMethodWrapper(this, 'year');
    }

    // Math functions
    round(): FilterClause {
        return Helpers.addMethodWrapper(this, 'round');
    }

    floor(): FilterClause {
        return Helpers.addMethodWrapper(this, 'floor');
    }

    ceiling(): FilterClause {
        return Helpers.addMethodWrapper(this, 'ceiling');
    }
}
