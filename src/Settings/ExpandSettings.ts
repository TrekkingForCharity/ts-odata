export class ExpandSettings {

    expand: string | null;
    defaultExpand: string | null;

    constructor() {
        this.expand = null;
        this.defaultExpand = null;
    }

    toString(): string {
        return '$expand=' + (this.expand || this.defaultExpand);
    }

    reset(): void {
        this.expand = null;
    }

    isSet(): boolean {
        return this.expand !== null || this.defaultExpand !== null;
    }
}
