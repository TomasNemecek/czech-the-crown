import Select, { type StylesConfig } from 'react-select';
import type { CnbRate } from '../../lib/parseCnb';

type Props = {
    rates: CnbRate[];
    value: CnbRate | null;
    onChange: (rate: CnbRate) => void;
    placeholder?: string;
    isDisabled: boolean;
    label: string;
};

type Option = {
    label: string;
    value: CnbRate;
};

const selectStyles: StylesConfig<Option> = {
    control: (base) => ({
        ...base,
        width: '100%',
        borderColor: 'var(--border)',
        borderRadius: '10px',
        transition: 'none',
        '&:hover': {
            borderColor: 'var(--gold)'
        }
    }),
    container: (base) => ({
        ...base,
        width: '100%',
        transition: 'none'
    }),
};

export function CurrencySelect({
    rates,
    value,
    onChange,
    placeholder = "Select currency...",
    isDisabled = false,
    label
}: Props) {
    const options: Option[] = rates.map(rate => ({
        label: `${rate.code} | ${rate.country} ${rate.currency}`,
        value: rate
    }));

    const selectedOption = value ? {
        label: `${value.code} | ${value.country} ${value.currency} `,
        value
    } : null;

    return (
        <Select<Option>
            options={options}
            value={selectedOption}
            onChange={(option) => option && onChange(option.value)}
            placeholder={placeholder}
            isDisabled={isDisabled}
            styles={selectStyles}
            aria-label={label}
        />
    );
}