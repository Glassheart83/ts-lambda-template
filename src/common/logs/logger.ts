const config = {
    isDebugEnabled: process.env.LOG_LEVEL.toUpperCase() === 'DEBUG',
    colors: {
        reset: '\x1b[0m',
        yellow: '\x1b[33m',
        red: '\x1b[31m'
    },
    requestId: undefined,
    functionName: undefined
};

const toJson = (entity: any) => JSON.stringify(entity, null, 3);
const printMessage = (message: string, entity: any) => `[${config.functionName}: ${config.requestId}] ${message}${entity ? ' -> ' + toJson(entity) : ''}`;

export const configureLogger = (requestId: string, functionName: string) => {
    config.requestId = requestId;
    config.functionName = functionName;
};

export const logger = {
    config,
    debug: (message: string, entity?: any): void => {
        if (config.isDebugEnabled) {
            console.debug(config.colors.reset, printMessage(message, entity));
        }
    },
    info: (message: string, entity?: any): void => {
        console.info(config.colors.reset, printMessage(message, entity));
    },
    warn: (message: string, entity?: any): void => {
        console.warn(config.colors.yellow, printMessage(message, entity));
    },
    error: (message: string, error?: Error, entity?: any): void => {
        console.error(config.colors.red, printMessage(message, entity));
        console.error(config.colors.red, error);
    }
};
