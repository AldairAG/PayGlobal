// Tipos para las respuestas de la API
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Tipos específicos para web
export interface UploadProgressEvent {
    loaded: number;
    total?: number;
    progress?: number;
    lengthComputable?: boolean;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: Record<string, unknown>;
}

// Tipo para respuesta paginada (Spring Boot Page)
export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

// Tipo para datos de request
export type RequestData = Record<string, unknown> | FormData | string | null | unknown;