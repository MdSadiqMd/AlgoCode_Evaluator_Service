/* import Docker from 'dockerode';

import { TestCases } from '../types/testCases.types'; */
import createContainer from './factory.container';
import { CPP_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import decodeDockerStream from '../utils/dockerHelper.utils';
import pullImage from '../utils/pullImage.utils';

async function runCpp(code: string, inputTestCase: string) {
    try {
        const rawLogBuffer: Buffer[] = [];
        logger.info(`Initialising Cpp Docker Container`);
        await pullImage(CPP_IMAGE);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
        logger.info(`${runCommand}`);
        const cppContainer = await createContainer(CPP_IMAGE, [
            '/bin/sh',
            '-c',
            runCommand
        ]);
        logger.info(`Created Cpp Docker Container`);
        await cppContainer.start();
        logger.info(`Started Cpp Docker Container`);

        const loggerStream = await cppContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true,
        });

        loggerStream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
        });

        const response = await new Promise((res) => {
            loggerStream.on('end', () => {
                logger.info('Log stream ended');
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                logger.info(`${JSON.stringify(decodedStream)}`);
                res(decodedStream);
            });
        });

        await cppContainer.remove();
        return response;
    } catch (error) {
        logger.error(`Error in Running Cpp Container: ${error}`);
    }
}

export default runCpp;