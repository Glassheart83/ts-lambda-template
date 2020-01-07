import { logger } from '@Common/logs/logger';

export type AuditOptions = {
    params?: boolean;
    time?: boolean;
}; 

/**
 * Decorator to allow instrumenting methods for debug purposes.
 * @param options AuditOptions allows to show in logs method parameters and time elapsed
 */
export function AuditLog(options: AuditOptions = {}) {
    return function (object: any, methodName: string, descriptor: PropertyDescriptor) {
        return {
            ...descriptor,
            value: function (...args: any[]) {

                const prefix = `[Audit] ${object.constructor.name}.${methodName}()`;
                if (options.params) {
                    logger.warn(`${prefix} method parameters`, args);
                }

                const before = Date.now();
                const result = descriptor.value.apply(this, args);
                const after = Date.now();
    
                if (options.time) {
                    logger.warn(`${prefix} execution time`, `${after - before}ms`);
                }
                return result;
            }
        };
    };
}
