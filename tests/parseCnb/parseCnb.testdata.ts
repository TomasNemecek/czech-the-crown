// Happy path test data for CNB parser tests
export const CNB_DAILY_RATES_OK = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.604
Brazil|real|1|BRL|3.890
Bulgaria|lev|1|BGN|12.439
Canada|dollar|1|CAD|14.941
`;

// Malformed First Line and Header test data for CNB parser tests
export const MISSING_HASHTAG = `
26 Sep 2025
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.604
`;

export const MISSING_DATE = `
#188
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.604
`;

export const MISSING_SEQUENCE = `
26 Sep 2025 #
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.604
`;

export const MISSING_HEADER = `
26 Sep 2025 #188

Australia|dollar|1|AUD|13.604
`;

export const MALFORMED_HEADER = `
26 Sep 2025 #188
Country|Currency|Amount|Code
Australia|dollar|1|AUD|13.604
`;


// Malformed Data Rows test data for CNB parser tests
export const EMPTY_DATA_ROWS = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
`;

export const MALFORMED_ROW_TOO_MANY = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.604|EXTRA
`

export const MALFORMED_ROW_TOO_FEW = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.604
Brazil|real|1|BRL
`

export const NEGATIVE_AMOUNT = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|-1|AUD|13.604
`

export const ZERO_AMOUNT = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|0|AUD|13.604
`

export const MALFORMED_AMOUNT = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|one|AUD|13.604
`

export const NEGATIVE_RATE = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|-13.604
`

export const ZERO_RATE = ` 
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|0
`

export const MALFORMED_RATE = `
26 Sep 2025 #188
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|thirteen
`