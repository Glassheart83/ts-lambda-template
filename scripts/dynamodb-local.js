const { spawn } = require('child_process'),
    fs = require('fs'),
    logFileName = 'dynamodb-local.log',
    lockFileName = `.dynamodb-local.pid.lock`,
    command = process.argv[2];

const readLock = () => {
    try {
        return fs.readFileSync(lockFileName);
    } catch (e) {
        return false;
    }
};

const start = () => {

    const out = fs.openSync(logFileName, 'a'),
        err = fs.openSync(logFileName, 'a');

    const sls = spawn('serverless', ['dynamodb', 'start'], {
        detached: true,
        stdio: ['ignore', out, err]
    });

    console.log(`Saving lock file with pid ${sls.pid}.`);
    fs.writeFileSync(lockFileName, sls.pid);

    sls.unref();
};

const stop = (pid) => {

    const kill = spawn('kill', ['--', `-${pid}`]);

    kill.on('close', (code, signal) => {
        console.log(`DynamoDB Local stopped successfully with code: ${code}.`);
    });
    fs.unlinkSync(lockFileName);
};

const lock = readLock();
switch (command) {
    case 'start':
        if (!lock) {
            console.log('DynamoDB Local is not running. Starting...');
            start();
        } else {
            console.log(`DynamoDB Local is running on pid ${lock.toString()}.`);
        }
        break;
    case 'stop':
        if (lock) {
            stop(lock.toString());
        } else {
            console.log('DynamoDB Local is not running.');
        }
        break;
    default:
        console.log('DynamoDB Local script options: [ start | stop ]');
}