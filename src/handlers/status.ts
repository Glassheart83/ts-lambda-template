export const lambda = (): any => {
    const ok = 200;
    return { 
        statusCode: ok, 
        body: JSON.stringify('')
    };
};
