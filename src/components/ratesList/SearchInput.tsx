import { InputSearch } from "@/styles";

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
  return (
    <InputSearch
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      {...inputProps}
    />
  );
}
