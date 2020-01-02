module.exports = async () => {

    const serverless = new (require('serverless'))();

    await serverless.init();
    const service = await serverless.variables.populateService();
    const resources = service.resources.reduce((st, current) => current.Resources, {});

    const tables = Object.keys(resources)
        .map(name => resources[name])
        .filter(r => r.Type === 'AWS::DynamoDB::Table')
        .map(r => {
            const props = r.Properties;
            if (props.TimeToLiveSpecification) {
                delete props.TimeToLiveSpecification
            }
            return props;
        });

    return {
        tables,
        port: service.custom.dynamodb.start.port
    }
}