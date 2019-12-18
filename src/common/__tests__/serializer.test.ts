import { serializer } from './../serializer';
import { Type, Expose } from 'class-transformer';

describe('Serializer should manipolate typescript objects', () => {

    class NestedTestEntity {

        @Expose()
        property: number;

        @Expose()
        @Type(() => Date)
        nestedDate: Date;
    }

    class TestEntity {
        
        @Expose()
        id: string;
        
        @Expose()
        @Type(() => Date)
        date: Date;

        @Expose()
        @Type(() => NestedTestEntity)
        nestedType: NestedTestEntity;

        constructor(fields: Partial<TestEntity>) {
            Object.assign(this, fields);
        }
    }

    test('Stringify a newly created class', async () => {

        const test = new TestEntity({
            id: 'aaa', 
            date: new Date()
        });

        const json = serializer<TestEntity>().stringify(test);

        expect(typeof json === 'string');
        expect(json).toBe(JSON.stringify(test));
    });

    test('Parse a plain object with date to class', async () => {

        const obj = {
            id: 'aaa',
            date: new Date()
        };

        const clazz = serializer<TestEntity>().parse(TestEntity, obj);

        expect(clazz).toBeInstanceOf(TestEntity);
    });


    test('Parse a plain object with date string to class', async () => {

        const obj = {
            id: 'aaa',
            date: '2019-12-18T13:34:43.169Z',
            nestedType: {
                property: 50,
                nestedDate: '2019-12-18T13:34:43.169Z'
            }
        };

        const clazz = serializer<TestEntity>().parse(TestEntity, obj);

        expect(clazz).toBeInstanceOf(TestEntity);
        expect(clazz.date).toBeInstanceOf(Date);
        expect(clazz.nestedType.nestedDate).toBeInstanceOf(Date);
    });

    test('Parse a plain object stripping out extraneous fields', async () => {

        const obj = {
            id: 'aaa',
            date: '2019-12-18T13:34:43.169Z',
            extraneous: 'extraneous',
            nestedType: {
                property: 50,
                nestedDate: '2019-12-18T13:34:43.169Z'
            }
        };

        const transformer = serializer<TestEntity>();
        const clazz = transformer.parse(TestEntity, obj);

        expect(clazz).toBeInstanceOf(TestEntity);
        
        const serialized = transformer.serialize(clazz);

        expect(serialized['extraneous']).toBeUndefined();
    });
});