import { TestEntity } from '@Storages/entities/testEntity';
import { serializer } from '@Common/serializer';
import { TestEntityStorage } from '@Storages/testEntityStorage';
import { IsString } from 'class-validator';
import { httpDecorator, validationDecorator } from '@Handlers/decorators/decorators';
import { HttpEvent } from '@Handlers/decorators/types';

class StatusEvent {

    @IsString()
    id: string;

    constructor(fields: Partial<StatusEvent>) {
        Object.assign(this, fields);
    }
}

export const lambda = httpDecorator(async (event: HttpEvent) => {

    const id = event.queryStringParameters['id'];
    const status = new StatusEvent({ id });
    const storage = new TestEntityStorage();

    return validationDecorator(status, async (event: StatusEvent) => {

        const entity = serializer<TestEntity>().parse(TestEntity, {
            id: event.id,
            region: 'local',
            registered: new Date(),
            env: process.env
        });

        await storage.save(entity);

        return entity;
    });
});
