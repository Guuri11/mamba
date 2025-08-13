interface TypographyProps {
    text: string;
    className?: string;
}

export function H1({ text, className }: TypographyProps) {
    return (
        <h1
            className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className || ""}`.trim()}
        >
            {text}
        </h1>
    );
}

export function H2({ text, className }: TypographyProps) {
    return (
        <h2
            className={`scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 ${className || ""}`.trim()}
        >
            {text}
        </h2>
    );
}

export function H3({ text, className }: TypographyProps) {
    return (
        <h3
            className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className || ""}`.trim()}
        >
            {text}
        </h3>
    );
}

export function Large({ text, className }: TypographyProps) {
    return <div className={`text-3xl font-semibold ${className || ""}`.trim()}>{text}</div>;
}
