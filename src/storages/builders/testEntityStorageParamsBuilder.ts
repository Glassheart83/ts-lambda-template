import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TestEntity } from '@Storages/entities/testEntity';
import { serializer } from '@Common/serializer';

export const testEntityStorageParamsBuilder = {
    buildSave: (data: TestEntity): DocumentClient.PutItemInput => ({
        Item: {
            ...serializer<TestEntity>().serialize(data),
            ttl: Date.now() / 1000 // TODO add ttl in config
        },
        TableName: process.env.TEST_ENTITY_TABLE_NAME
    })
};