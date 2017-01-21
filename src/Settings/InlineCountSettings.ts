export class InlineCountSettings {
    inlineCount: string;
    defaultInlineCount: string;

    constructor() {
        this.inlineCount = null;
        this.defaultInlineCount = null;
    }


    toString(): string {
        return '$inlinecount=' + (this.inlineCount || this.defaultInlineCount);
    }

    reset(): void {
        this.inlineCount = null;
    }

    isSet(): boolean {
        return this.inlineCount !== null || this.defaultInlineCount !== null;
    }
}
