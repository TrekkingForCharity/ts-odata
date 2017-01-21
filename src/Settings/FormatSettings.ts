export class FormatSettings {
    format: string;
    defaultFormat: string;

    constructor() {
        this.format = null;
        this.defaultFormat = null;
    }

    toString(): string {
        return '$format=' + (this.format || this.defaultFormat);
    }

    reset(): void {
        this.format = null;
    }

    isSet(): boolean {
        return this.format !== null || this.defaultFormat !== null;
    }
}
