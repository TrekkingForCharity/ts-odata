export class InlineCountSettings {
    inlineCount: string | null;
    defaultInlineCount: string | null;

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
