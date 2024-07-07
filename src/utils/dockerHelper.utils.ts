import { DockerStreamOutput } from "../types";
import { DOCKER_STREAM_HEADER_SIZE } from "./constants.utils";
import logger from "../config/logger.config";

export function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
    let offset = 0; // This variable keeps track of the current position in the buffer while parsing
    const output: DockerStreamOutput = { stdout: '', stderr: '' }; // The output that will store the accumulated stdout and stderr output as strings

    while (offset < buffer.length) {
        const typeOfStream = buffer[offset];
        const length = buffer.readUint32BE(offset + 4);
        offset += DOCKER_STREAM_HEADER_SIZE;

        if (typeOfStream === 1) {
            output.stdout += buffer.toString('utf-8', offset, offset + length);
        } else if (typeOfStream === 2) {
            output.stderr += buffer.toString('utf-8', offset, offset + length);
        }
        offset += length;
    }
    return output;
}

export function fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string> {
    return new Promise((res, rej) => {
        loggerStream.on('end', () => {
            logger.info('Log stream ended');
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            logger.info(`${JSON.stringify(decodedStream)}`);
            if (decodedStream.stderr) {
                rej(decodedStream.stderr);
            } else {
                res(decodedStream.stdout);
            }
        });
    });
}