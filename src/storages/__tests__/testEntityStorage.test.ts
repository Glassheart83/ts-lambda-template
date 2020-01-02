import 'reflect-metadata';
import { TestEntity } from '@Storages/entities/testEntity';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { serializer } from '@Common/serializer';
import { TestEntityStorage } from '@Storages/testEntityStorage';

describe('TestEntityStorage should insert and read from dynamodb', () => {

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            testEntityTableName: 'local_test_entity'
        };
    });

    test('Inserting a test entity', async () => {

        const client = new DocumentClient({
            endpoint: 'localhost:9988',
            sslEnabled: false,
            region: 'local'
        });

        const entity = serializer<TestEntity>().parse(TestEntity, {
            id: 'aaa',
            region: 'italy',
            registered: new Date(),
            env: process.env
        });

        const storage = new TestEntityStorage(client);
        await storage.save(entity);

    }, 30000);
});