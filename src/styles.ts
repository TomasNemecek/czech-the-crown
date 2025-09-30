import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle<{ theme: any }>`
  :root {
    --bg: ${({ theme }) => theme.colors.bg};
    --card: ${({ theme }) => theme.colors.card};
    --text: ${({ theme }) => theme.colors.text};
    --subtle: ${({ theme }) => theme.colors.subtle};
    --border: ${({ theme }) => theme.colors.border};
    --gold: ${({ theme }) => theme.colors.gold};
    --goldSoft: ${({ theme }) => theme.colors.goldSoft};
    --radius: ${({ theme }) => theme.radius};
    --shadow: ${({ theme }) => theme.shadow};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background: var(--bg);
    color: var(--text);
  }
  a { color: inherit; }
  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(212,175,55,0.35);
    border-radius: 6px;
  }
`;

export const Shell = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
`;

export const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: 0.2px;
`;

export const Subtle = styled.p`
  margin: 4px 0 16px;
  color: var(--subtle);
`;

export const Card = styled.section`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 16px;
`;

/* Search input */
export const InputSearch = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  margin-bottom: 12px;

  &:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.25);
    outline: none;
  }
`;

/* List wrapper */
export const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

/* Rate row */
export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 10px;
  padding: 10px 8px;         
  border-bottom: 1px solid var(--border);

  &:hover { background: var(--goldSoft); }
`;

export const RowLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
`;

export const CountryCodeBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.35px;
  color: var(--text);
  background: linear-gradient(180deg, #fffdf3 0%, #fff4cf 100%);
  border: 1px solid rgba(212, 175, 55, 0.45);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.55);
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.06s ease;

`;

export const CurrencyText = styled.span`
  color: var(--subtle);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13.5px;
`;

export const Figure = styled.div`
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: right;
  font-size: 14px;
`;

export const Subtext = styled.div`
  color: var(--subtle);
  font-size: 12px;
  text-align: right;
`;

export const ButtonGhost = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
  transition: transform .06s ease;
  &:hover { transform: translateY(-1px); }
`;

export const Heading3 = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
`;

// --- Converter styles ---

export const InputNumeric = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  &:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.25);
    outline: none;
  }
`;