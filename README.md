# ts-lambda-template
### Introduction
*ts-lambda-template* is a boilerplate project, with some premade technical choices already made, some utility code already included and some example code that aim to show the preferable application architecture.
It's written in TypeScript using the NodeJS runtime for lambda execution.
### Usage
- TODO
### Dependencies
Some libraries are already included to address the most common issues when bootstrapping this kind of projects.
Those are worth some details:
- `es-lint` has been used both to check code style consistency and to manipulate the code at compile time to apply the code style. Since `es-lint` is an extremely powerful tool that is now including a complete TypeScript support, only some mostly common rules are customised: the file `.eslintrc.yml` is already preconfigured for TypeScript support and most common rules and much more can be added.
More details on all supported customisation here: [TypeScript ESLint Plugin](https://github.com/typescript-eslint/typescript-eslint)
- `browserify` had been included through it's Serverless plugin `serverless-plugin-browserifier` in order to optimize each lambda package with only the imported code. This encourage to write leaner code, avoiding overengineering and overpatterning.
- `ttypescript` is a TypeScript code transformer acting as a preprocessor for the `tsc` compiler. It can be used to apply transformations to the code at compile time to achieve behaviours that are not modified by the compiler itself. In this boilerplate `typescript-transform-paths` is applied in order to make a good usage of TypeScript path aliases feature: only absolute imports are used when coding using aliases specified in `tsconfig.json`, and they are replaced with real paths by the transformer at compile time.
Here how the transformation process works together with some available transformers and the documentation on how to write additional ones: [Transformer TypeScript Project Page](https://github.com/cevek/tTypeScript)
- The local development takes advantage for the most simple offline lambda environment available. While a complete emulation of the lambda stack could be achieved with various Docker images, this project takes advantage of the *Serverless Framework* and two plugins: `serverless-offline` and `serverless-dynamodb-local`, that allow to run a local lambda environment with **some** features.
- `jest` is used for testing in order to his integration with TypeScript through `ts-jest` and a local *DynamoDB* runner through `jest-dynamodb`. Tests are written in TypeScript and can be used to test real behaviours on *DynamoDB*.
### Project structure
- TODO