export function AuditLog(target: any, key: string, descriptor: PropertyDescriptor) {

    const method = descriptor.value;
    descriptor.value = function(...args: any[]) {

        console.log('*** AUDIT');
        console.log(key + '(' + args.join(', ') + ')');
        const result = method.apply(this, args);
        console.log('*** END AUDIT');
        console.log('=> ' + result);
        return result;
    };

    return descriptor;
}
