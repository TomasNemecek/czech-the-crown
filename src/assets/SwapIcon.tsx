import type { SVGProps } from 'react';

export function SwapIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M0,11h11.2l-2.6,2.6L10,15l6-6H0V11z M4.8,5l2.6-2.6L6,1L0,7h16V5H4.8z" />
        </svg>
    );
}