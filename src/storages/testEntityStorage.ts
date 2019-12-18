import { serializer } from './../common/serializer';
import { TestEntity } from './entities/testEntity';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class TestEntityStorage {

    client: DocumentClient;
    transformer = serializer<TestEntity>();

    constructor(client: DocumentClient) {
        this.client = client;
    }

    /* async save(data: Partial<TestEntity> = {}): Promise<TestEntity> {

        const result = await this.client.put().promise();

    } */
}