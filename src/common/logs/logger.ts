export class Logger {

    private isDebugEnabled: boolean;
    requestId: string;
    functionName: string;

    private toJson = (entity: any) => JSON.stringify(entity, null, 3);
    private colors = {
        reset: '\x1b[0m',
        yellow: '\x1b[33m',
        red: '\x1b[31m'
    };
    private printMessage = (message: string, entity: any) => `[${this.functionName}: ${this.requestId}] ${message}${entity ? ' -> ' + this.toJson(entity) : ''}`;

    constructor(requestId: string, functionName: string) {
        this.requestId = requestId;
        this.functionName = functionName;
        this.isDebugEnabled = process.env.logLevel === 'DEBUG';
    }

    debug(message: string, entity?: any): void {
        if (this.isDebugEnabled) {
            console.debug(this.colors.reset, this.printMessage(message, entity));
        }
    }

    info(message: string, entity?: any): void {
        console.info(this.colors.reset, this.printMessage(message, entity));
    }

    warn(message: string, entity?: any): void {
        console.warn(this.colors.yellow, this.printMessage(message, entity));
    }

    error(message: string, error?: Error, entity?: any): void {
        console.error(this.colors.red, this.printMessage(message, entity));
        console.error(this.colors.red, error);
    }
}

export const loggerProvider = () => {
    let logger = undefined;
    return {
        provide: (requestId: string, functionName: string): void => {
            logger = new Logger(requestId, functionName);
        },
        retrieve: (): Logger => logger
    };
};

export const logger = loggerProvider().retrieve();