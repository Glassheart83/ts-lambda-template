import { plainToClass, classToPlain, ClassTransformOptions } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

class Serializer<T> {

    private options: ClassTransformOptions = {
        excludeExtraneousValues: true
    };

    parse(type: ClassType<T>, data: object): T {
        return plainToClass(type, data, this.options);
    }

    serialize(data: T): any {
        return classToPlain(data, this.options);
    }

    stringify(data: T, indent: number = null): string {
        const serialized = this.serialize(data);
        return JSON.stringify(serialized, null, indent);
    }
}

export const serializer = <T>(): Serializer<T> => new Serializer<T>();