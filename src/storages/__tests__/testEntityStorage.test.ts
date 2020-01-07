import { TestEntity } from '@Storages/entities/testEntity';
import { serializer } from '@Common/serializer';
import { TestEntityStorage } from '@Storages/testEntityStorage';

describe('TestEntityStorage should insert and read from dynamodb', () => {

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            testEntityTableName: 'local_test_entity',
            AWS_REGION: 'local',
            dynamoEndpointUrl: 'localhost:9988'
        };
    });

    test('Inserting a test entity', async () => {

        const entity = serializer<TestEntity>().parse(TestEntity, {
            id: 'aaa',
            region: 'italy',
            registered: new Date(),
            env: process.env
        });

        const storage = new TestEntityStorage();
        await storage.save(entity);

    }, 30000);
});