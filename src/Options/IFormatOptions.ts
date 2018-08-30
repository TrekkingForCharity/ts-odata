import {Tso} from '../Tso';
export interface IFormatOptions {
    /**
     * $format=atom
     * @returns {Tso}
     * @memberof IFormatOptions
     */
    atom(): Tso;

    /**
     * $format=text/csv
     * @param {string} value (usually mime, like 'text/csv')
     * @returns {Tso}
     * @memberof IFormatOptions
     */
    custom(value: string): Tso;

    /**
     * Usage: query.format().json();
     * Output: $format=json
     * @returns {Tso}
     * @memberof IFormatOptions
     */
    json(): Tso;

    /**
     * Usage: query.format().xml();
     * Output: $format=xml
     * @returns {Tso}
     * @memberof IFormatOptions
     */
    xml(): Tso;
}
