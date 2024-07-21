/* import Docker from 'dockerode';

import { TestCases } from '../types/testCases.types'; */
import createContainer from './factory.container';
import { JAVA_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import { fetchDecodedStream } from '../utils/dockerHelper.utils';
import pullImage from '../utils/pullImage.utils';
import codeExecutorStrategy, { ExecutionResponse } from './codeExecutorStrategy.container';

class JavaExecutor implements codeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputCase: string): Promise<ExecutionResponse> {
        try {
            const rawLogBuffer: Buffer[] = [];
            logger.info(`Initialising Java Docker Container`);
            await pullImage(JAVA_IMAGE);
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

            try {
                const response: string = await fetchDecodedStream(loggerStream, rawLogBuffer);
                if (response.trim() === outputCase.trim()) {
                    return { output: response, status: "SUCCESS" };
                } else {
                    return { output: response, status: "WA" };
                }
            } catch (error: any) {
                logger.error(`Error in Judging Code: ${error}`);
                if (error === "TLE") {
                    await javaContainer.kill();
                }
                return { output: error as string, status: "ERROR" };
            } finally {
                await javaContainer.remove();
            }
        } catch (error: any) {
            logger.error(`Error in Running Java Container: ${JSON.stringify(error)}`);
            return { output: error.toString(), status: 'FAILED' };
        }
    }
}

export default JavaExecutor;