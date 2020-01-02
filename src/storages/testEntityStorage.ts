import { testEntityStorageParamsBuilder } from './builders/testEntityStorageParamsBuilder';
import { serializer } from '@Common/serializer';
import { TestEntity } from './entities/testEntity';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class TestEntityStorage {

    client: DocumentClient;
    transformer = serializer<TestEntity>();

    constructor(client: DocumentClient) {
        this.client = client;
    }

    async save(data: TestEntity): Promise<TestEntity> {

        const params = testEntityStorageParamsBuilder.buildSave(data);
        const result = await this.client.put(params).promise();

        console.log(result);

        return data;
    }
}