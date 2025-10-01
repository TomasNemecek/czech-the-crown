import { describe, it, expect } from "vitest";
import { parseCnbTxt } from "@/util/parseCnb";
import {
  CNB_DAILY_RATES_OK,
  MISSING_DATE,
  MISSING_HASHTAG,
  MISSING_SEQUENCE,
  MISSING_HEADER,
  MALFORMED_HEADER,
  EMPTY_DATA_ROWS,
  MALFORMED_ROW_TOO_MANY,
  MALFORMED_ROW_TOO_FEW,
  NEGATIVE_AMOUNT,
  ZERO_AMOUNT,
  MALFORMED_AMOUNT,
  NEGATIVE_RATE,
  ZERO_RATE,
  MALFORMED_RATE,
} from "./parseCnb.testdata";

//HAPPY PATH: parseCnbTxt -> parseFirstLine -> validateHeader -> parseDataRows
describe("parseCnbTxt - parses correctly", () => {
  const dailyRates = parseCnbTxt(CNB_DAILY_RATES_OK);

  it("parses date, sequence and rates", () => {
    expect(dailyRates.date).toBe("26 Sep 2025");
    expect(dailyRates.sequence).toBe(188);
    expect(dailyRates.rates).toHaveLength(4);
  });

  it("parses first CnbRate correctly", () => {
    expect(dailyRates.rates[0]).toEqual({
      country: "Australia",
      currency: "dollar",
      amount: 1,
      code: "AUD",
      rate: 13.604,
    });
  });

  it("parses last CnbRate correctly", () => {
    expect(dailyRates.rates[3]).toEqual({
      country: "Canada",
      currency: "dollar",
      amount: 1,
      code: "CAD",
      rate: 14.941,
    });
  });
});

// ERROR PATH: parseCnbTxt -> parseFirstLine
describe("parseCnbTxt - parseFirstLine - error cases", () => {
  it("throws on empty first line", () => {
    expect(() => parseCnbTxt(``)).toThrow("CNB Data first line is empty");
  });
  it("throws on missing #", () => {
    expect(() => parseCnbTxt(MISSING_HASHTAG)).toThrow(
      "CNB Data first line is malformed, missing #",
    );
  });

  it("throws on missing date", () => {
    expect(() => parseCnbTxt(MISSING_DATE)).toThrow(
      "CNB Data first line is malformed, missing date",
    );
  });
  it("throws on missing sequence number", () => {
    expect(() => parseCnbTxt(MISSING_SEQUENCE)).toThrow(
      "CNB Data first line is malformed, missing sequence number",
    );
  });
});

// ERROR PATH: parseCnbTxt -> validateHeader
describe("parseCnbTxt - validateHeader - error cases", () => {
  it("throws on missing header", () => {
    expect(() => parseCnbTxt(MISSING_HEADER)).toThrow(
      "CNB header line is empty",
    );
  });
  it("throws on malformed header", () => {
    expect(() => parseCnbTxt(MALFORMED_HEADER)).toThrow(
      "CNB header line is malformed or missing required columns.",
    );
  });
});

//ERROR PATH: parseCnbTxt -> parseDataRows
describe("parseCnbTxt - parseDataRows - error cases", () => {
  it("throws on empty data rows", () => {
    expect(() => parseCnbTxt(EMPTY_DATA_ROWS)).toThrow(
      "CNB Data contains no rate lines",
    );
  });
  it("throws malformed data - too many parts", () => {
    expect(() => parseCnbTxt(MALFORMED_ROW_TOO_MANY)).toThrow(
      "CNB Data line 0 is malformed, expected 5 parts but got 6",
    );
  });
  it("throws malformed data - too few parts", () => {
    expect(() => parseCnbTxt(MALFORMED_ROW_TOO_FEW)).toThrow(
      "CNB Data line 1 is malformed, expected 5 parts but got 4",
    );
  });
  it("throws malformed data - negative amount", () => {
    expect(() => parseCnbTxt(NEGATIVE_AMOUNT)).toThrow(
      "CNB Data line 0 has invalid amount: -1",
    );
  });
  it("throws malformed data - zero amount", () => {
    expect(() => parseCnbTxt(ZERO_AMOUNT)).toThrow(
      "CNB Data line 0 has invalid amount: 0",
    );
  });
  it("throws malformed data - non-numeric amount", () => {
    expect(() => parseCnbTxt(MALFORMED_AMOUNT)).toThrow(
      "CNB Data line 0 has invalid amount: one",
    );
  });
  it("throws malformed data - negative rate", () => {
    expect(() => parseCnbTxt(NEGATIVE_RATE)).toThrow(
      "CNB Data line 0 has invalid rate: -13.604",
    );
  });
  it("throws malformed data - zero rate", () => {
    expect(() => parseCnbTxt(ZERO_RATE)).toThrow(
      "CNB Data line 0 has invalid rate: 0",
    );
  });
  it("throws malformed data - non-numeric rate", () => {
    expect(() => parseCnbTxt(MALFORMED_RATE)).toThrow(
      "CNB Data line 0 has invalid rate: thirteen",
    );
  });
});
