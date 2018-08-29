export class SelectSettings {
    select: string[] | null;
    defaultSelect: string[] | null;

    constructor() {
        this.select = null;
        this.defaultSelect = null;
    }


    toString(): string | null {
        let selectArray = (this.select || this.defaultSelect);
        return selectArray ? '$select=' + selectArray.join(',') : null;
    }

    reset(): void {
        this.select = null;
    }

    isSet(): boolean {
        return this.select !== null || this.defaultSelect !== null;
    }
}
