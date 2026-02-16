import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorLog = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            status,
            error: exception instanceof Error ? exception.message : exception,
            stack: exception instanceof Error ? exception.stack : null,
        };

        try {
            const logPath = path.join(process.cwd(), 'error.log');
            fs.appendFileSync(logPath, JSON.stringify(errorLog, null, 2) + '\n---\n');
        } catch (e) {
            console.error('Failed to write to error log', e);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: exception instanceof Error ? exception.message : 'Unknown error'
        });
    }
}
