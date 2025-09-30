export class CnbParseError extends Error {
  private _line: string;

  constructor(message: string, line: string = "") {
    super(message);
    this.name = "CnbParseError";
    this._line = line;
  }

  get line(): string | undefined {
    return this._line;
  }
}
