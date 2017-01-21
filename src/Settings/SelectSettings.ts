export class SelectSettings {
    select: string[];
    defaultSelect: string[];

    constructor() {
        this.select = null;
        this.defaultSelect = null;
    }


    toString(): string {
        let selectArray = (this.select || this.defaultSelect);
        return '$select=' + selectArray.join(',');
    }

    reset(): void {
        this.select = null;
    }

    isSet(): boolean {
        return this.select !== null || this.defaultSelect !== null;
    }
}
