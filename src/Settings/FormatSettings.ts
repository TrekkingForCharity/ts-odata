export class FormatSettings {
    format: string | null;
    defaultFormat: string | null;

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
