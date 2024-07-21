/* import Docker from 'dockerode';

import { TestCases } from '../types/testCases.types'; */
import createContainer from './factory.container';
import { CPP_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import { fetchDecodedStream } from '../utils/dockerHelper.utils';
import pullImage from '../utils/pullImage.utils';
import codeExecutorStrategy, { ExecutionResponse } from './codeExecutorStrategy.container';


class CppExecutor implements codeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputCase: string): Promise<ExecutionResponse> {
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
                    await cppContainer.kill();
                }
                return { output: error as string, status: "ERROR" };
            } finally {
                await cppContainer.remove();
            }
        } catch (error: any) {
            logger.error(`Error in Running Cpp Container: ${JSON.stringify(error)}`);
            return { output: error.toString(), status: 'FAILED' };
        }
    }
}

export default CppExecutor;