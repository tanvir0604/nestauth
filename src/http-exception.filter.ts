import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = 500;
        let message = "Internal Server Error";

        // Check using instanceof or shape fallback
        if (
            exception instanceof HttpException ||
            (exception?.status && exception?.response)
        ) {
            status = exception.status ?? 500;

            const exceptionResponse =
                exception.response ?? exception.getResponse?.();
            if (typeof exceptionResponse === "string") {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === "object" &&
                (exceptionResponse as any).message
            ) {
                message = (exceptionResponse as any).message;
            } else if (
                typeof exceptionResponse === "object" &&
                (exceptionResponse as any).error
            ) {
                message = (exceptionResponse as any).error;
            }
        } else {
            console.error("Unexpected error:", exception);
        }

        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            app: "nestauth",
        });
    }
}
