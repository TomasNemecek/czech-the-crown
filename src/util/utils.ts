
export function sanitizeInput(input: string, maxLength: number = 100): string {
    return input
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/[<>]/g, '')
        .trimStart()
        .trimEnd()
        .slice(0, maxLength);
}