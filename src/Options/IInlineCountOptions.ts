import {Tso} from '../Tso';
export interface IInlineCountOptions {
    /**
     * $inlinecount=allpages
     * @returns {Tso}
     * @memberof IInlineCountOptions
     */
    allPages(): Tso;

    /**
     * $inlinecount=none
     * @returns {Tso}
     * @memberof IInlineCountOptions
     */
    none(): Tso;
}
