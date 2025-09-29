import { InputSearch } from "../styles";

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    "aria-label"?: string;
};

export function SearchInput({ value, onChange, placeholder, ...a11y }: Props) {
    return (
        <InputSearch
            value={value}
            placeholder={placeholder ?? "Search code, currency, or country…"}
            onChange={(e) => onChange(e.target.value)}
            {...a11y}
        />
    );
}
