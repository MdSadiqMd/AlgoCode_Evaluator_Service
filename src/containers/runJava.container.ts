/* import Docker from 'dockerode';

import { TestCases } from '../types/testCases.types'; */
import createContainer from './factory.container';
import { JAVA_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import decodeDockerStream from '../utils/dockerHelper.utils';

async function runJava(code: string, inputTestCase: string) {
    try {
        const rawLogBuffer: Buffer[] = [];
        logger.info(`Initialising Java Docker Container`);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
        logger.info(`${runCommand}`);
        const javaContainer = await createContainer(JAVA_IMAGE, [
            '/bin/sh',
            '-c',
            runCommand
        ]);
        logger.info(`Created Java Docker Container`);
        await javaContainer.start();
        logger.info(`Started Java Docker Container`);

        const loggerStream = await javaContainer.logs({
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
                logger.info(`${decodedStream.stdout}`);
                logger.info(`${decodedStream.stderr}`);
                res(decodedStream);
            });
        });

        await javaContainer.remove();
    } catch (error) {
        logger.error(`Error in Running Java Container: ${error}`);
    }
}

export default runJava;