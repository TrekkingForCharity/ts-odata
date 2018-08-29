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

    currentHashRoute: string | null = null;

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

    /**
    * To create a TsoData query object, you instantiate it by passing your base uri into the constructor.
    *
    * @example
    * var query = new Tso('http://test.com');
    *
    * @param {string} baseUri
    * @memberof Tso
    */
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

    /**
     * Setting .orderBy will override the default. Calling .resetOrderBy() will restore the default.
     *
     * @example
     * query.setOrderByDefault('p1', 'desc').orderBy('p2').asc();
     * Will be:
     * $orderby=p2 asc
     *
     * @param {string} property
     * @param {string} [order]
     * @returns {Tso}
     * @memberof Tso
     */
    setOrderByDefault(property: string, order?: string): Tso {
        this.OrderBySettings.defaultProperty = property;
        this.OrderBySettings.defaultOrder = order === undefined ? 'desc' : order;
        return this;
    }

    /**
     * Toggles the order by value on a given property between desc and asc.
     * If the orderby property has not been set yet, it will default to desc.
     *
     * @param {string} property
     * @param {Function} [callback]
     * @returns {Tso}
     * @memberof Tso
     */
    toggleOrderBy(property: string, callback?: Function): Tso {
        let useDesc = (this.OrderBySettings.property === null || this.OrderBySettings.order === 'asc');
        (<any>this.orderBy(property))[useDesc ? 'desc' : 'asc']();

        if (callback && typeof callback === 'function') {
            (<any>callback).call(this);
        }

        return this;
    }

    /**
     * Order by is a singleton property, so you can call .orderBy as many times as you like and the result will always be the last one.
     *
     * @example
     * $orderby=PropertyName
     *
     * @param {string} property
     * @returns {Tso}
     * @memberof Tso
     */
    orderBy(property: string): Tso {
        this.OrderBySettings.property = property;
        return this;
    }

    /**
     * Set descending order.
     *
     * Which ever order is called last will be the one that wins, so writing
     * query.orderBy('PropertyName').asc().desc()
     *
     * will result in
     *
     * $orderby=PropertyName desc
     *
     * @example
     * $orderby=PropertyName desc
     *
     * @returns {Tso}
     * @memberof Tso
     */
    desc(): Tso {
        this.OrderBySettings.order = 'desc';
        return this;
    }

    /**
     * Set ascending order.
     *
     * Which ever order is called last will be the one that wins, so writing
     * query.orderBy('PropertyName').desc().asc()
     *
     * will result in
     *
     * $orderby=PropertyName asc
     *
     * @example
     * $orderby=PropertyName asc
     *
     * @returns {Tso}
     * @memberof Tso
     */
    asc(): Tso {
        this.OrderBySettings.order = 'asc';
        return this;
    }

    /**
     * OrderBy settings are removed
     * (Reverts back what was set in setOrderByDefault)
     *
     * @returns {Tso}
     * @memberof Tso
     */
    resetOrderBy(): Tso {
        this.OrderBySettings.reset();
        return this;
    }

    /**
     * Setting .top will override the default. Calling .resetTop() will restore the default.
     *
     * @example
     * query.setTopDefault(5).top(10);
     *
     * will result in
     *
     * $top=10
     *
     * Then, resetting will restore the default:
     * query.resetTop()
     *
     * will result in
     *
     * $top=5
     * @param {number} top
     * @returns {Tso}
     * @memberof Tso
     */
    setTopDefault(top: number): Tso {
        this.TopSettings.defaultTop = top;
        return this;
    }

    /**
     * Top is a singleton property, so you can call .top as many times as you like and the result will always be the last one.
     *
     * @example
     * $top=10
     *
     * @param {number} top
     * @returns {Tso}
     * @memberof Tso
     */
    top(top: number): Tso {
        this.TopSettings.top = top;
        return this;
    }

    /**
     * Top settings are removed.
     * (Reverts back what was set in setTopDefault)
     *
     * @returns {Tso}
     * @memberof Tso
     */
    resetTop(): Tso {
        this.TopSettings.reset();
        return this;
    }

    /**
     * Setting .skip will override the default. Calling .resetSkipTop() will restore the default.
     *
     * @example
     * query.setSkipDefault(5).skip(10);
     *
     * will result in
     *
     * $skip=10
     *
     * Then, resetting will restore the default:
     * query.resetSkip()
     *
     * will result in
     *
     * $skip=5
     * @param {number} skip
     * @returns {Tso}
     * @memberof Tso
     */
    setSkipDefault(skip: number): Tso {
        this.SkipSettings.defaultSkip = skip;
        return this;
    }

    /**
     * Skip is a singleton property, so you can call .skip as many times as you like and the result will always be the last one.
     *
     * @example
     * $skip=10
     *
     * @param {number} skip
     * @returns {Tso}
     * @memberof Tso
     */
    skip(skip: number): Tso {
        this.SkipSettings.skip = skip;
        return this;
    }

    /**
     * Skip settings are removed.
     * (Reverts back what was set in setSkipDefault)
     *
     * @returns {Tso}
     * @memberof Tso
     */
    resetSkip(): Tso {
        this.SkipSettings.reset();
        return this;
    }

    /**
     * Setting .select will override the default. Calling .resetSelect() will restore the default.
     *
     * @example
     * query
     *      .setSelectDefault(['CustomerId', 'CustomerName'])
	 *      .select(['CustomerId', 'CustomerName', 'Address']);
     *
     * will result in
     *
     * $select=CustomerId,CustomerName,Address
     *
     * Then, resetting will restore the default:
     * query.resetSelect();
     *
     * will result in
     *
     * $select=CustomerId,CustomerName
     * @param {string[]} select
     * @returns {Tso}
     * @memberof Tso
     */
    setSelectDefault(select: string[]): Tso {
        this.SelectSettings.defaultSelect = select;
        return this;
    }

    /**
     * Select is a singleton property, so you can call .select as many times as you like and the result will always be the last one.
     * select takes in an array of property names.
     *
     * @example
     * query.select(['Property1', 'Property2]);
     *
     * will result in
     *
     * $select=Property1,Property2
     * @param {string[]} select
     * @returns {Tso}
     * @memberof Tso
     */
    select(select: string[]): Tso {
        this.SelectSettings.select = select;
        return this;
    }

    /**
     * Select settings are removed.
     * (Reverts back what was set in setSelectDefault)
     *
     * @returns {Tso}
     * @memberof Tso
     */
    resetSelect(): Tso {
        this.SelectSettings.reset();
        return this;
    }

    /**
     * Setting .expand() will override the default. Calling .resetExpand() will restore the default.
     *
     * @example
     * $expand=Customer
     *
     * @param {string} expand
     * @returns {Tso}
     * @memberof Tso
     */
    setExpandDefault(expand: string): Tso {
        this.ExpandSettings.defaultExpand = expand;
        return this;
    }

    /**
     * Expand is a singleton property, so you can call .expand as many times as you like and the result will always be the last one.
     *
     * @example
     * $expand=Customer
     *
     * @param {string} expand
     * @returns {Tso}
     * @memberof Tso
     */
    expand(expand: string): Tso {
        this.ExpandSettings.expand = expand;
        return this;
    }

    /**
     * The expand is removed
     * (Reverts back what was set in setExpandDefault)
     *
     * @returns {Tso}
     * @memberof Tso
     */
    resetExpand(): Tso {
        this.ExpandSettings.reset();
        return this;
    }

    /**
     * Calling .resetFormat() will remove any format settings or restore the default.
     *
     * @memberof Tso
     */
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

    /**
     * To get the query in oData format, call toString off of your query object.
     *
     * @returns {string}
     * @memberof Tso
     */
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
