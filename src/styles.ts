import styled, { createGlobalStyle } from "styled-components";

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

export const theme = {
  colors: {
    bg: "#f7f6f2",
    card: "#ffffff",
    text: "#1f2937",
    subtle: "#6b7280",
    border: "#e5e7eb",
    gold: "#d4af37",
    goldSoft: "#fff7e0",
    goldDark: "#b48918",
  },
  radius: "14px",
  shadow: "0 10px 30px rgba(0,0,0,0.08)",
};

export type AppTheme = typeof theme;

// =============================================================================
// GLOBAL STYLES
// =============================================================================

export const GlobalStyle = createGlobalStyle<{ theme: AppTheme }>`
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

// =============================================================================
// UI COMPONENTS
// =============================================================================

export const Card = styled.section`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 16px;
`;
