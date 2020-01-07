import 'reflect-metadata';
import { Expose, Type } from 'class-transformer';

export class TestEntity {

    @Expose()
    id: string;

    @Expose()
    region: string;

    @Expose()
    @Type(() => Date)
    registered: Date;

    @Expose()
    env: { [key: string]: string }
}