import { DocumentClient } from 'aws-sdk/clients/dynamodb';

let client: DocumentClient = undefined;

export const defaultDocumentClient = () => {
    if (!client) {
        client = new DocumentClient({
            apiVersion: '2012-08-10',
            convertEmptyValues: true,
            sslEnabled: false,
            region: process.env.AWS_REGION,
            endpoint: process.env.dynamoEndpointUrl
        });
    }
    return client;
};
