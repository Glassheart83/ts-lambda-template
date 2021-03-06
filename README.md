# ts-lambda-template
## Introduction
*ts-lambda-template* is a boilerplate project, with some premade technical choices already made, some utility code already included and some example code that aim to show the preferable application architecture.
It's written in TypeScript using the NodeJS runtime for lambda execution.
## Usage
Various verbs are available through `yarn`.
- `yarn` or `yarn install` install the dependencies.
- `yarn start [environment]` start the application using the configuration of the specified environment. *local* is the most common as it use the local DynamoDB, but also *dev*, *ath*, *qa* are usable using remote configuration.
- `yarn lint` runs the linter and code formatting.
- `yarn build` runs a clean, the linter and build the code. Built code is stored in `dist/` directory.
- `yarn test` runs Jest suite, running all tests under `__tests__` folders in `src/`.
## Dependencies
Some libraries are already included to address the most common issues when bootstrapping this kind of projects.
Those are worth some details:
- `es-lint` has been used both to check code style consistency and to manipulate the code at compile time to apply the code style. Since `es-lint` is an extremely powerful tool that is now including a complete TypeScript support, only some mostly common rules are customised: the file `.eslintrc.yml` is already preconfigured for TypeScript support and most common rules and much more can be added.
More details on all supported customisation here: [TypeScript ESLint Plugin](https://github.com/typescript-eslint/typescript-eslint)
- `browserify` had been included through it's Serverless plugin `serverless-plugin-browserifier` in order to optimize each lambda package with only the imported code. This encourage to write leaner code, avoiding overengineering and overpatterning.
- `ttypescript` is a TypeScript code transformer acting as a preprocessor for the `tsc` compiler. It can be used to apply transformations to the code at compile time to achieve behaviours that are not modified by the compiler itself. In this boilerplate `typescript-transform-paths` is applied in order to make a good usage of TypeScript path aliases feature: only absolute imports are used when coding using aliases specified in `tsconfig.json`, and they are replaced with real paths by the transformer at compile time.
Here how the transformation process works together with some available transformers and the documentation on how to write additional ones: [Transformer TypeScript Project Page](https://github.com/cevek/tTypeScript)
- The local development takes advantage for the most simple offline lambda environment available. While a complete emulation of the lambda stack could be achieved with various Docker images, this project takes advantage of the *Serverless Framework* and two plugins: `serverless-offline` and `serverless-dynamodb-local`, that allow to run a local lambda environment with **some** features.
- `jest` is used for testing in order to his integration with TypeScript through `ts-jest` and a local *DynamoDB* runner through `jest-dynamodb`. Tests are written in TypeScript and can be used to test real behaviours on *DynamoDB*.
## Project structure
The project is structured to thin layers and focus the lambda function as entrypoint.
Some relevant packages in project structure are:
- `handlers` is meant to be a collection of lambda functions themselves and support classes. Lambda functions are meant to be wrapper in two utility decorators constructing typings and managing errors.
    - `httpDecorator` is used to wrap functions exposed through API Gateway.
    - `invocationDecorator` is used to wrap functions meant to be called from other functions.

    A simple lambda function should follow this example:
    ```ts
    class Event {

        @IsString() // decorator used for validation
        id: string;

        constructor(fields: Partial<Event>) {
            Object.assign(this, fields);
        }
    }

    export const lambda = httpDecorator(async (event: HttpEvent) => {

        // use the http wrapped event to get parameters you need from the request
        const id = event.queryStringParameters['id'];

        // construct the event (it's preferrable to have it as a non exported object to limit its usage to the layer)
        const instance = new Event({ id });

        return validationDecorator(instance, async (event: StatusEvent) => {
            // do logic with the validated object
        });
    });
    ```
    An extensive documentation of validation decorators can be found here: [Class Validator Documentation](https://github.com/typestack/class-validator)
- `storages` is meant to be the designated directory for repositories and database-layered model entities (`entities`) and object manipulations (`builders`). `builders` are required to convert the coded models in data structures meaningful to DynamoDB. DynamoDB only understands few types of data (see [Dynamo Data Types](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.DataTypes.html) for more details) so some transformations (for example for dates) is required.
- Utility components are provided under `common` folder:
    - `LambdaInvoker` can be used to invoke a lambda given the name of the function as specified in `serverless.yml` and the event object to be passed.
        ```ts
        const invoker = new LambdaInvoker();
        await invoker.invoke('callableFunction', { 
            param1: 'TEST', 
            param2: true 
        });
        ```
    - `Logger` can be used for logging and is configured with `requestId` and `functionName`. It also take cares to serialize objects if passed and to manage debug logging consistently with `LOG_LEVEL` environment variable.
    - `Audit` is a decorator that can be used to measure specific indicators, like input parameters and execution time, when used on annotated methods. It's mostly useful for debug purpose and performance optimizations.
        ```ts
        class DatabaseStorage {

            @AuditLog({ params: true, time: true })
            async save(entity: Entity): Promise<Entity> {
                // save logic is expected to happen
            }
        }
        ```
        expected output:
        ```sh
        [ts-lambda-template-local-status: offline_awsRequestId_ck55caoxg0002usk80g877lhw] [Audit] DatabaseStorage.save() method parameters -> [
            {
                "id": "aaa",
                "region": "local",
                "registered": "2020-01-08T13:29:38.793Z",
            }
        ]
        [ts-lambda-template-local-status: offline_awsRequestId_ck55caoxg0002usk80g877lhw] [Audit] DatabaseStorage.save() execution time -> "12ms"
        ```
    - `Serializer` is an utility class that can be used to construct class instance from plain objects and back using `class-transformer` under the hood.
        ```ts
        class TestEntity {
            id: string;
            date: Date;
        }

        const obj = {
            id: 'aaa',
            date: new Date()
        };

        const instance = serializer<TestEntity>().parse(TestEntity, obj);

        expect(obj).toBeInstanceOf(TestEntity); // is false
        expect(instance).toBeInstanceOf(TestEntity); // is true
        ```
    - Error classes are provided to wrap custom application errors and have them meaningfully serialized to the client.
## Configuration
Two main configuration files are included:
- `config/resources.yml` is meant to contain AWS Resources in matter of DynamoDB tables, IAM roles and policies, etc.
- `config/env.yml` is meant to reference environment variables. Following the [Serverless Variables](https://serverless.com/framework/docs/providers/aws/guide/variables/) it is possible to reference in this files variables from other yml files, for example if it's required to discern variables between different stage. Anyway, it's raccomended to include only this file in `serverless.yml`.