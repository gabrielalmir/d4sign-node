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
    }
}
