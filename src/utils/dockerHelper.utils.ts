import { DockerStreamOutput } from "../types";
import { DOCKER_STREAM_HEADER_SIZE } from "./constants.utils";

function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
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

export default decodeDockerStream;