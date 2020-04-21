import * as path from 'path';
import * as sourceMapSupport from 'source-map-support';
import * as winston from "winston";
import * as winstonRotate from "winston-daily-rotate-file";
sourceMapSupport.install();

export class LoggerService {
    constructor(options?: winston.LoggerOptions) {
        this.winstonLogger = winston.createLogger(options || this.defaultOptions);
        this.winstonLogger.exitOnError = false;
    }
    public static logger: LoggerService;
    winstonLogger: winston.Logger;
    defaultOptions: winston.LoggerOptions = {
        format: winston.format.json(),
        transports: [
            new winstonRotate({
                filename: path.resolve("dist", "logs", 'error-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'error'
            }),
            new winstonRotate({
                filename: path.resolve("dist", "logs", 'info-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'info'
            }),
            new winston.transports.Console({ level: "info" })
        ],
        exceptionHandlers: [
            new winstonRotate({
                filename: path.resolve("dist", "logs", 'exceptions-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'
            })
        ]
    }

    private setErrorStack() {
        Error.prepareStackTrace = (err, structuredStackTrace) => {
            return structuredStackTrace.map((itm, index) => {
                var source = itm.getFileName() || itm["getScriptNameOrSourceURL"]();
                if (source) {
                    var line = itm.getLineNumber();
                    var column = itm.getColumnNumber() - 1;
                    var position = sourceMapSupport.mapSourcePosition({
                        source: source,
                        line: line,
                        column: column
                    });
                    var sources = position.source.split(':');
                    if (sources.length > 1)
                        return { ...position, ...{ source: sources[sources.length - 1] } };
                }
            }).filter(itm => itm);
        }
    }
    public error(error): winston.Logger {
        // this.setErrorStack();
        console.error(error);
        if (this.winstonLogger)
            return this.winstonLogger.error(error);
    }

    public info(info): winston.Logger {
        // this.setErrorStack();
        console.info(info);
        if (this.winstonLogger)
            return this.winstonLogger.info(info);
    }

    public static async init(options?: winston.LoggerOptions) {
        if (!this.logger)
            this.logger = new LoggerService(options);
    }
}
LoggerService.init();
export const logger: LoggerService = LoggerService.logger;