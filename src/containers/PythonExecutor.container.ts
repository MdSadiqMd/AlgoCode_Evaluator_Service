import createContainer from './factory.container';
import { PYTHON_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';
import { fetchDecodedStream } from '../utils/dockerHelper.utils';
import pullImage from '../utils/pullImage.utils';
import codeExecutorStrategy, { ExecutionResponse } from './codeExecutorStrategy.container';

class PythonExecutor implements codeExecutorStrategy {
    private cachedResult: ExecutionResponse | null = null;

    async execute(code: string, inputTestCases: string[], outputTestCases: string[]): Promise<ExecutionResponse> {
        const flattenedInputTestCases = inputTestCases.flat();
        const flattenedOutputTestCases = outputTestCases.flat();
        if (flattenedInputTestCases.length !== flattenedOutputTestCases.length) {
            throw new Error("Mismatch between input and output test cases length");
        }

        this.cachedResult = await this.run(code, flattenedInputTestCases[0], flattenedOutputTestCases[0]);
        if (this.cachedResult.status !== "SUCCESS") {
            return this.cachedResult;
        }
        for (let i = 0; i < flattenedInputTestCases.length; i++) {
            const input = flattenedInputTestCases[i];
            const output = flattenedOutputTestCases[i];
            const result = await this.run(code, input, output);
            if (result.status !== "SUCCESS") {
                this.cachedResult = null;
                return result;
            }
        }
        return this.cachedResult;
    }

    async run(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
        try {
            const rawLogBuffer: Buffer[] = [];
            logger.info(`Initialising Python Docker Container`);
            // const pythonContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
            await pullImage(PYTHON_IMAGE);
            const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
            logger.info(`Run Command: ${runCommand}`);

            const pythonContainer = await createContainer(PYTHON_IMAGE, [
                '/bin/sh',
                '-c',
                runCommand,
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
                if (response.trim() === outputTestCase.trim()) {
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
            logger.error(`Error in Running Python Container: ${JSON.stringify(error)}`);
            return { output: error.toString(), status: 'FAILED' };
        }
    }
}

export default PythonExecutor;