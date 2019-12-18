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

    return validationDecorator(status, async (event: StatusEvent) => ({
        ...event,
        ...process.env
    }));
});
