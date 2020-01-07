import { defaultDocumentClient } from '@Storages/documentClientFactory';
import { TestEntity } from '@Storages/entities/testEntity';
import { serializer } from '@Common/serializer';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AuditLog } from '@Common/logs/audit';
import { testEntityStorageParamsBuilder } from '@Storages/builders/testEntityStorageParamsBuilder';

export class TestEntityStorage {

    client: DocumentClient;
    transformer = serializer<TestEntity>();

    constructor(client: DocumentClient = defaultDocumentClient()) {
        this.client = client;
    }

    @AuditLog({ params: true, time: true })
    async save(data: TestEntity): Promise<TestEntity> {

        const params = testEntityStorageParamsBuilder.buildSave(data);
        await this.client.put(params).promise();

        return data;
    }
}