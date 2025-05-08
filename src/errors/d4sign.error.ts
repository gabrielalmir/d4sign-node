export class D4SignError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any) {
        super(message);
        this.name = 'D4SignError';
        this.status = status;
        this.data = data;
    }
}
