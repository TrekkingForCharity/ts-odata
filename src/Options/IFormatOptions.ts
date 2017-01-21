import {Tso} from '../Tso';
export interface IFormatOptions {
    atom(): Tso;
    custom(value: string): Tso;
    json(): Tso;
    xml(): Tso;
}
