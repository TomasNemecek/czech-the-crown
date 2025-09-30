import { CnbParseError } from "@/util/errors";
import type { CnbRate, CnbDailyRates } from "@/types/CnbDailyRates";

export function parseCnbTxt(txt: string): CnbDailyRates {
  //Example CNB txt format:
  //  26 Sep 2025 #188 - First line - date and sequence
  //  Country|Currency|Amount|Code|Rate
  //  Australia|dollar|1|AUD|13.604

  const [firstLine, header, ...rows] = txt.trim().split(/\r?\n/);
  const { date, sequence } = parseFirstLine(firstLine);
  validateHeader(header);

  const rates: CnbRate[] = parseDataRows(rows);

  return { date, sequence, rates };
}

function parseFirstLine(firstLine: string): { date: string; sequence: number } {
  if (!firstLine)
    throw new CnbParseError("CNB Data first line is empty", firstLine);

  const hashtagIndex = firstLine.indexOf("#");
  if (hashtagIndex === -1)
    throw new CnbParseError(
      "CNB Data first line is malformed, missing #",
      firstLine,
    );

  const datePart = firstLine.slice(0, hashtagIndex).trim();
  if (!datePart)
    throw new CnbParseError(
      "CNB Data first line is malformed, missing date",
      firstLine,
    );

  const sequencePart = firstLine.slice(hashtagIndex + 1).trim();
  if (!sequencePart)
    throw new CnbParseError(
      "CNB Data first line is malformed, missing sequence number",
      firstLine,
    );

  return { date: datePart, sequence: Number(sequencePart) };
}

function validateHeader(headerLine: string): void {
  if (!headerLine) {
    throw new CnbParseError("CNB header line is empty", headerLine);
  }

  const normalizedHeader = headerLine
    .split("|")
    .map((s) => s.trim().toLowerCase())
    .join("|");

  if (normalizedHeader !== "country|currency|amount|code|rate")
    throw new CnbParseError(
      "CNB header line is malformed or missing required columns.",
      headerLine,
    );
}

function parseDataRows(rows: string[]): CnbRate[] {
  if (rows.length === 0)
    throw new CnbParseError("CNB Data contains no rate lines");

  return rows.map((line, i) => {
    const parts = line.split("|");
    if (parts.length !== 5)
      throw new CnbParseError(
        `CNB Data line ${i} is malformed, expected 5 parts but got ${parts.length}`,
        line,
      );

    const [country, currency, amountString, code, rateString] = parts.map((s) =>
      s.trim(),
    );

    const amount = Number(amountString);
    if (isNaN(amount) || amount <= 0)
      throw new CnbParseError(
        `CNB Data line ${i} has invalid amount: ${amountString}`,
        line,
      );

    const rate = Number(rateString.replace(",", ".")); //switch to dot for decimal
    if (isNaN(rate) || rate <= 0)
      throw new CnbParseError(
        `CNB Data line ${i} has invalid rate: ${rateString}`,
        line,
      );

    return { country, currency, amount, code, rate: rate };
  });
}
