import { FilterClause } from './FilterClause';
import { FilterObj } from './FilterObj';
export class PrecedenceGroup {
    clauses: any[];

    constructor(filterClause: FilterClause = undefined) {
        this.clauses = [];

        if (filterClause !== undefined) {
            this.clauses.push(new FilterObj(filterClause));
        }
    }
    isEmpty(): boolean {
        return this.clauses.length === 0;
    }
    andFilter(filterClause: FilterClause): PrecedenceGroup {
        this.clauses.push(new FilterObj(filterClause, 'and'));
        return this;
    }
    orFilter(filterClause: FilterClause): PrecedenceGroup {
        this.clauses.push(new FilterObj(filterClause, 'or'));
        return this;
    }
    toString(): string {
        let filter: any, i: any;
        filter = '(';
        for (i = 0; i < this.clauses.length; i++) {
            filter += this.clauses[i].toString(i);
        }
        filter += ')';

        return filter;
    }
}
