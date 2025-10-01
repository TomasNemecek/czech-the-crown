import styled from "styled-components";
import { sanitizeInput } from "@/util/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search code, currency, or country…",
  ...inputProps
}: Props) {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(event.target.value, 50);
    onChange(sanitizedValue);
  };

  return (
    <InputSearch
      value={value}
      placeholder={placeholder}
      onChange={handleInputChange}
      {...inputProps}
    />
  );
}

const InputSearch = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  margin-bottom: var(--spacing-md);

  &:focus {
    border-color: var(--gold);
    box-shadow: var(--shadow-focus);
    outline: none;
  }
`;
