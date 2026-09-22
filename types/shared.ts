export interface Error {
    message: string;
    data?: unknown;
    status?: number;
    error?:{
        message: string;
        status?: number;
        path?: string;
    }
}