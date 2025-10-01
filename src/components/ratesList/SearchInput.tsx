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
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  margin-bottom: 12px;

  &:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.25);
    outline: none;
  }
`;
