/**
 * Represents a custom error specific to D4Sign operations.
 * Extends the built-in `Error` class to include additional properties
 * such as HTTP status code and response data.
 */
export class D4SignError extends Error {
    /**
     * The HTTP status code associated with the error.
     */
    status: number;

    /**
     * Additional data or payload related to the error.
     */
    data: any;

    /**
     * Creates an instance of `D4SignError`.
     *
     * @param message - A descriptive error message.
     * @param status - The HTTP status code associated with the error.
     * @param data - Additional data or payload related to the error.
     */
    constructor(message: string, status: number, data: any) {
        super(message);
        this.name = 'D4SignError';
        this.status = status;
        this.data = data;
        // Keep `instanceof D4SignError` working even if the compile target
        // is ever lowered below ES2015
        Object.setPrototypeOf(this, D4SignError.prototype);
    }
}

/**
 * Converts any error raised during a D4Sign API request into a `D4SignError`.
 *
 * @param error - Error object (typically an `AxiosError`)
 * @throws D4SignError always
 */
export function handleApiError(error: any): never {
    if (error instanceof D4SignError) {
        throw error;
    }

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;
        // The API may return `message` as a string or an array of strings
        const message = data && data.message
            ? (Array.isArray(data.message) ? data.message.join('; ') : data.message)
            : (data !== undefined && data !== null && data !== '' ? JSON.stringify(data) : 'Unknown error');
        throw new D4SignError(`D4Sign API Error: ${status} - ${message}`, status, data);
    } else if (error.request) {
        // The request was made but no response was received
        throw new D4SignError(
            `D4Sign API Error: No response received - ${error.message}`,
            0,
            null
        );
    } else {
        // Something happened in setting up the request that triggered an Error
        throw new D4SignError(`D4Sign API Error: ${error.message}`, 0, null);
    }
}
