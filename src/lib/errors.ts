export class CnbParseError extends Error {
    constructor(message: string, public line?: string) {
        super(message);
        this.name = "CnbParseError";
    }
}