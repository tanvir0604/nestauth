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

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else {
            console.error("Unexpected error:", exception);
        }

        response.status(status).json({
            statusCode: status,
            message: message,
            path: request.url,
            app: "nestauth",
        });
    }
}
