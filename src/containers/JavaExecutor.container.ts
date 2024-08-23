import createContainer from './factory.container';
import { JAVA_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import { fetchDecodedStream } from '../utils/dockerHelper.utils';
import pullImage from '../utils/pullImage.utils';
import codeExecutorStrategy, { ExecutionResponse } from './codeExecutorStrategy.container';

class JavaExecutor implements codeExecutorStrategy {
    async execute(code: string, inputTestCases: string[], outputTestCases: string[]): Promise<ExecutionResponse> {
        const flattenedInputTestCases = inputTestCases.flat();
        const flattenedOutputTestCases = outputTestCases.flat();
        if (flattenedInputTestCases.length !== flattenedOutputTestCases.length) {
            throw new Error("Mismatch between input and output test cases length");
        }

        for (let i = 0; i < flattenedInputTestCases.length; i++) {
            const input = flattenedInputTestCases[i];
            const output = flattenedOutputTestCases[i];
            const result = await this.run(code, input, output);
            if (result.status !== "SUCCESS") {
                return result;
            }
        }
        return await this.run(code, flattenedInputTestCases[0], flattenedOutputTestCases[0]);
    }

    async run(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
        try {
            const rawLogBuffer: Buffer[] = [];
            logger.info(`Initializing Java Docker Container`);
            await pullImage(JAVA_IMAGE);
            const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
            logger.info(`Run Command: ${runCommand}`);

            const javaContainer = await createContainer(JAVA_IMAGE, [
                '/bin/sh',
                '-c',
                runCommand,
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
                if (response.trim() === outputTestCase.trim()) {
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