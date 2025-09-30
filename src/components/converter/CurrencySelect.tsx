import Select from 'react-select';
import type { CnbRate } from '../../lib/parseCnb';

type Props = {
    rates: CnbRate[];
    value: CnbRate | null;
    onChange: (rate: CnbRate) => void;
    placeholder?: string;
    isDisabled?: boolean;
};

type Option = {
    label: string;
    value: CnbRate;
};

export function CurrencySelect({
    rates,
    value,
    onChange,
    placeholder = "Select currency...",
    isDisabled = false,
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
        />
    );
}