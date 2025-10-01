/**
 * Sanitizes user input by removing control characters, HTML characters,
 * and limiting length to prevent potential security issues and improve UX.
 */
export function sanitizeInput(input: string, maxLength: number = 100): string {
    return input
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters and escape sequences
        .replace(/[<>]/g, '') // Remove potential HTML characters
        .trimStart() // Remove leading whitespace while typing
        .slice(0, maxLength); // Limit to reasonable length
}