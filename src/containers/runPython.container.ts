/* import Docker from 'dockerode';

import { TestCases } from '../types/testCases.types'; */
import createContainer from './factory.container';
import { PYTHON_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import decodeDockerStream from '../utils/dockerHelper.utils';
import pullImage from '../utils/pullImage.utils';

async function runPython(code: string, inputTestCase: string) {
    try {
        const rawLogBuffer: Buffer[] = [];
        logger.info(`Initialising Python Docker Container`);
        // const pythonContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
        await pullImage(PYTHON_IMAGE);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
        logger.info(`${runCommand}`);
        const pythonContainer = await createContainer(PYTHON_IMAGE, [
            '/bin/sh',
            '-c',
            runCommand
        ]);
        logger.info(`Created Python Docker Container`);
        await pythonContainer.start();
        logger.info(`Started Python Docker Container`);

        const loggerStream = await pythonContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true,
        });

        loggerStream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
        });

        await new Promise((res) => {
            loggerStream.on('end', () => {
                logger.info('Log stream ended');
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                logger.info(`stdout: ${decodedStream.stdout}`);
                logger.error(`stderr: ${decodedStream.stderr}`);
                res(decodedStream);
            });
        });

        await pythonContainer.remove();
    } catch (error) {
        logger.error(`Error in Running Python Container: ${error}`);
    }
}

export default runPython;