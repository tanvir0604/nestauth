import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = 500;
        let message = "Internal Server Error";

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

        const responseBody = {
            statusCode: status,
            message,
            path: request?.url,
            app: "nestauth",
        };

        // Try to send response for Express or Fastify
        try {
            if (
                typeof response.status === "function" &&
                typeof response.json === "function"
            ) {
                response.status(status).json(responseBody);
            } else if (typeof response.send === "function") {
                response.code?.(status); // Fastify specific
                response.send(responseBody);
            } else {
                console.error("Unsupported response object:", response);
            }
        } catch (err) {
            console.error("Error while sending error response:", err);
        }
    }
}
