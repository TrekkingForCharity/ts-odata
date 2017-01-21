import {FilterClause} from  '../FilterClause';
import {PrecedenceGroup} from  '../PrecedenceGroup';
import {FilterObj} from '../FilterObj';
export class FilterSettings {
    Filters: any[];
    DefaultFilters: any[];
    CapturedFilter: any[];

    constructor() {
        this.Filters = [];
        this.DefaultFilters = [];
        this.CapturedFilter = [];
    }

    toString() {
        let allFilters: any[], i: any, filter: any;

        allFilters = [];
        filter = '$filter=';

        if (this.DefaultFilters.length > 0) {
            for (i = 0; i < this.DefaultFilters.length; i++) {
                allFilters.push(this.DefaultFilters[i]);
            }
        }

        for (i = 0; i < this.Filters.length; i++) {
            allFilters.push(this.Filters[i]);
        }

        for (i = 0; i < allFilters.length; i++) {
            filter += allFilters[i].toString(i);
        }

        return encodeURI(filter);
    }

    reset() {
        this.Filters = [];
        if (this.CapturedFilter.length > 0) {
            for (let i = 0; i < this.CapturedFilter.length; i++) {
                this.Filters.push(this.CapturedFilter[i]);
            }
        }
    }

    fullReset(): void {
        this.Filters = [];
        this.CapturedFilter = [];
    }

    loadFromJson(filterSettings: any): void {
        let i: any, filter: any;


        for (i = 0; i < filterSettings.Filters.length; i++) {
            filter = filterSettings.Filters[i];
            let fO: FilterObj = new FilterObj(this.loadFilterObj(filter.filterObj), filter.logicalOperator);
            this.Filters.push(fO);
        }

        for (i = 0; i < filterSettings.DefaultFilters.length; i++) {
            filter = filterSettings.DefaultFilters[i];
            this.DefaultFilters.push(new FilterObj(this.loadFilterObj(filter.filterObj), filter.logicalOperator));
        }
    }

    isSet(): boolean {
        return this.Filters.length > 0 || this.DefaultFilters.length > 0;
    }


    private loadPrecedenceGroup(precedenceGroup: any): any {
        let j: any, group: any, currentClause: any;

        group = new PrecedenceGroup();

        for (j = 0; j < precedenceGroup.clauses.length; j++) {
            currentClause = precedenceGroup.clauses[j];
            group.clauses.push(new FilterObj(this.loadFilterObj(currentClause.filterObj), currentClause.logicalOperator));
        }

        return group;
    };

    private loadFilterObj(currentFilter: any): any {
        if (currentFilter.clauses !== undefined) {
            return this.loadPrecedenceGroup(currentFilter);
        }

        let key: any;

        let newFilterClause = new FilterClause('123');

        for (key in currentFilter) {
            if (currentFilter.hasOwnProperty(key)) {
                (<any>newFilterClause)[key] = currentFilter[key];
            }
        }

        return newFilterClause;
    };
}
