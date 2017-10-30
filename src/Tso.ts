import {FilterClause} from './FilterClause';
import {PrecedenceGroup} from './PrecedenceGroup';
import {FilterObj} from './FilterObj';
import {OrderBySettings} from './Settings/OrderBySettings';
import {TopSettings} from './Settings/TopSettings';
import {SkipSettings} from './Settings/SkipSettings';
import {SelectSettings} from './Settings/SelectSettings';
import {ExpandSettings} from './Settings/ExpandSettings';
import {FormatSettings} from './Settings/FormatSettings';
import {InlineCountSettings} from './Settings/InlineCountSettings';
import {FilterSettings} from './Settings/FilterSettings';
import {IFormatOptions} from './Options/IFormatOptions';
import {IInlineCountOptions} from './Options/IInlineCountOptions';

export class Tso {

    baseUri: string;
    ExpandSettings: ExpandSettings;
    FilterSettings: FilterSettings;
    FormatSettings: FormatSettings;
    InlineCountSettings: InlineCountSettings;
    OrderBySettings: OrderBySettings;
    SelectSettings: SelectSettings;
    SkipSettings: SkipSettings;
    TopSettings: TopSettings;
    format: IFormatOptions;
    formatDefault: IFormatOptions;
    inlineCount: IInlineCountOptions;
    inlineCountDefault: IInlineCountOptions;

    currentHashRoute: string;

    static literal(stringLiteral: string): string {
        return '\'' + stringLiteral.toString() + '\'';
    }

    static datetime(datetime: string): string {
        return 'datetime\'' + datetime + '\'';
    }

    static guid(guid: string): string {
        return 'guid\'' + guid + '\'';
    }

    static v4guid(guid: string): string {
      return 'v4guid' + guid;
    }

    static decimal(decimal: number): string {
        return decimal + 'm';
    }

    static double(double: number): string {
        return double + 'd';
    }

    static single(single: number) {
        return single + 'f';
    }



    constructor(baseUri: string) {
        this.baseUri = baseUri;
        this.OrderBySettings = new OrderBySettings();
        this.ExpandSettings = new ExpandSettings();
        this.FilterSettings = new FilterSettings();
        this.FormatSettings = new FormatSettings();
        this.InlineCountSettings = new InlineCountSettings();
        this.OrderBySettings = new OrderBySettings();
        this.SelectSettings = new SelectSettings();
        this.SkipSettings = new SkipSettings();
        this.TopSettings = new TopSettings();

        let contextThis = this;

        this.format = {

            atom: function () {
              contextThis.FormatSettings.format = 'atom';
                return contextThis;
            },
            custom: function (value) {
              contextThis.FormatSettings.format = value;
                return contextThis;
            },
            xml: function () {
              contextThis.FormatSettings.format = 'xml';
                return contextThis;
            },
            json: function () {
              contextThis.FormatSettings.format = 'json';
                return contextThis;
            }
        };
        this.formatDefault = {
            atom: function () {
              contextThis.FormatSettings.defaultFormat = 'atom';
                return contextThis;
            },
            custom: function (value) {
              contextThis.FormatSettings.defaultFormat = value;
                return contextThis;
            },
            xml: function () {
              contextThis.FormatSettings.defaultFormat = 'xml';
                return contextThis;
            },
            json: function () {
              contextThis.FormatSettings.defaultFormat = 'json';
                return contextThis;
            }
        };

        this.inlineCount = {
            allPages: function () {
              contextThis.InlineCountSettings.inlineCount = 'allpages';
                return contextThis;
            },
            none: function () {
              contextThis.InlineCountSettings.inlineCount = 'none';
                return contextThis;
            }
        };

        this.inlineCountDefault = {
            allPages: function () {
              contextThis.InlineCountSettings.defaultInlineCount = 'allpages';
                return contextThis;
            },
            none: function () {
              contextThis.InlineCountSettings.defaultInlineCount = 'none';
                return contextThis;
            }
        };

    }



    updateHashRoute(hashRoute: string): void {
        this.currentHashRoute = hashRoute;
    }

    // order by
    setOrderByDefault(property: string, order?: string): Tso {
        this.OrderBySettings.defaultProperty = property;
        this.OrderBySettings.defaultOrder = order === undefined ? 'desc' : order;
        return this;
    }

    toggleOrderBy(property: string, callback?: Function): Tso {
        let useDesc = (this.OrderBySettings.property === null || this.OrderBySettings.order === 'asc');
        (<any>this.orderBy(property))[useDesc ? 'desc' : 'asc']();

        if (callback && typeof callback === 'function') {
            (<any>callback).call(this);
        }

        return this;
    }

    orderBy(property: string): Tso {
        this.OrderBySettings.property = property;
        return this;
    }

    desc(): Tso {
        this.OrderBySettings.order = 'desc';
        return this;
    }

    asc(): Tso {
        this.OrderBySettings.order = 'asc';
        return this;
    }

    resetOrderBy(): Tso {
        this.OrderBySettings.reset();
        return this;
    }

    // top
    setTopDefault(top: number): Tso {
        this.TopSettings.defaultTop = top;
        return this;
    }

    top(top: number): Tso {
        this.TopSettings.top = top;
        return this;
    }

    resetTop(): Tso {
        this.TopSettings.reset();
        return this;
    }

    // skip
    setSkipDefault(skip: number): Tso {
        this.SkipSettings.defaultSkip = skip;
        return this;
    }

    skip(skip: number): Tso {
        this.SkipSettings.skip = skip;
        return this;
    }

    resetSkip(): Tso {
        this.SkipSettings.reset();
        return this;
    }

    // select
    setSelectDefault(select: string[]): Tso {
        this.SelectSettings.defaultSelect = select;
        return this;
    }

    select(select: string[]): Tso {
        this.SelectSettings.select = select;
        return this;
    }

    resetSelect(): Tso {
        this.SelectSettings.reset();
        return this;
    }

    // expand
    setExpandDefault(expand: string): Tso {
        this.ExpandSettings.defaultExpand = expand;
        return this;
    }

    expand(expand: string): Tso {
        this.ExpandSettings.expand = expand;
        return this;
    }

    resetExpand(): Tso {
        this.ExpandSettings.reset();
        return this;
    }

    // format


    resetFormat(): void {
        this.FormatSettings.reset();
    }

    // Inline count


    resetInlineCount(): Tso {
        this.InlineCountSettings.reset();
        return this;
    }

    // Filter
    filter(filterClause: FilterClause|PrecedenceGroup): Tso {
        this.FilterSettings.Filters.push(new FilterObj(filterClause));
        return this;
    }

    andFilter(filterClause: FilterClause|PrecedenceGroup): Tso {
        this.FilterSettings.Filters.push(new FilterObj(filterClause, 'and'));
        return this;
    }

    orFilter(filterClause: FilterClause|PrecedenceGroup): Tso {
        this.FilterSettings.Filters.push(new FilterObj(filterClause, 'or'));
        return this;
    }

    removeFilter(property: string): Tso {
        if (!this.FilterSettings.isSet()) {
            return this;
        }

        for (let i = 0; i < this.FilterSettings.Filters.length; i++) {
            if (this.FilterSettings.Filters[i].filterObj.property === property) {
                this.FilterSettings.Filters.splice(i, 1);
            }
        }

        return this;
    }

    captureFilter(): void {
        this.FilterSettings.CapturedFilter = [];
        for (let i = 0; i < this.FilterSettings.Filters.length; i++) {
            this.FilterSettings.CapturedFilter.push(this.FilterSettings.Filters[i]);
        }
    }

    resetFilter(): Tso {
        this.FilterSettings.fullReset();
        return this;
    }

    resetToCapturedFilter(): Tso {
        this.FilterSettings.reset();
        return this;
    }

    defaultFilter(filterClause: FilterClause): Tso {
        this.FilterSettings.DefaultFilters.push(new FilterObj(filterClause));
        return this;
    }

    defaultAndFilter(filterClause: FilterClause): Tso {
        this.FilterSettings.DefaultFilters.push(new FilterObj(filterClause, 'and'));
        return this;
    }

    defaultOrFilter(filterClause: FilterClause): Tso {
        this.FilterSettings.DefaultFilters.push(new FilterObj(filterClause, 'or'));
        return this;
    }

    // Casts
    toString(): string {
        let url: any, components: any;

        url = this.baseUri;
        components = [];

        if (this.OrderBySettings.isSet()) {
            components.push(this.OrderBySettings.toString());
        }

        if (this.TopSettings.isSet()) {
            components.push(this.TopSettings.toString());
        }

        if (this.SkipSettings.isSet()) {
            components.push(this.SkipSettings.toString());
        }

        if (this.SelectSettings.isSet()) {
            components.push(this.SelectSettings.toString());
        }

        if (this.FilterSettings.isSet()) {
            components.push(this.FilterSettings.toString());
        }

        if (this.ExpandSettings.isSet()) {
            components.push(this.ExpandSettings.toString());
        }

        if (this.FormatSettings.isSet()) {
            components.push(this.FormatSettings.toString());
        }

        if (this.InlineCountSettings.isSet()) {
            components.push(this.InlineCountSettings.toString());
        }

        return components.length > 0 ? url + '?' + components.join('&') : url;
    }

    toJson(): string {
        let jsonObj: any = {};

        jsonObj.baseUri = this.baseUri;
        jsonObj.currentHashRoute = this.currentHashRoute;

        jsonObj.OrderBySettings = null;
        jsonObj.TopSettings = null;
        jsonObj.SkipSettings = null;
        jsonObj.SelectSettings = null;
        jsonObj.ExpandSettings = null;
        jsonObj.FormatSettings = null;
        jsonObj.InlineCountSettings = null;
        jsonObj.FilterSettings = null;

        jsonObj.defaults = (<any>this).defaults;

        if (this.OrderBySettings.isSet()) {
            jsonObj.OrderBySettings = this.OrderBySettings;
        }

        if (this.TopSettings.isSet()) {
            jsonObj.TopSettings = this.TopSettings;
        }

        if (this.SkipSettings.isSet()) {
            jsonObj.SkipSettings = this.SkipSettings;
        }

        if (this.SelectSettings.isSet()) {
            jsonObj.SelectSettings = this.SelectSettings;
        }

        if (this.ExpandSettings.isSet()) {
            jsonObj.ExpandSettings = this.ExpandSettings;
        }

        if (this.FormatSettings.isSet()) {
            jsonObj.FormatSettings = this.FormatSettings;
        }

        if (this.InlineCountSettings.isSet()) {
            jsonObj.InlineCountSettings = this.InlineCountSettings;
        }

        if (this.FilterSettings.isSet()) {
            jsonObj.FilterSettings = this.FilterSettings;
        }

        return JSON.stringify(jsonObj);
    }



}
