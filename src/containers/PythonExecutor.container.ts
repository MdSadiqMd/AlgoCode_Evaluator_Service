/* import Docker from 'dockerode';

import { TestCases } from '../types/testCases.types'; */
import createContainer from './factory.container';
import { PYTHON_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import { fetchDecodedStream } from '../utils/dockerHelper.utils';
import pullImage from '../utils/pullImage.utils';
import codeExecutorStrategy, { ExecutionResponse } from './codeExecutorStrategy.container';

class PythonExecutor implements codeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputCase: string): Promise<ExecutionResponse> {
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
                    await pythonContainer.kill();
                }
                return { output: error as string, status: "ERROR" };
            } finally {
                await pythonContainer.remove();
            }
        } catch (error: any) {
            logger.error(`Error in Running Python Container: ${error}`);
            return { output: error.toString(), status: 'FAILED' };
        }
    }
}

export default PythonExecutor;