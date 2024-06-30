import Docker from 'dockerode';

import logger from '../config/logger.config';

async function pullImage(imageName: string) {
    try {
        const docker = new Docker();
        return new Promise((res, rej) => {
            docker.pull(imageName, (error: Error, stream: NodeJS.ReadableStream) => {
                if (error) throw error;
                docker.modem.followProgress(stream, (error, response) => error ? rej(error) : res(response), (event) => {
                    logger.info(event.status);
                });
            });
        });
    } catch (error) {
        logger.error(`Error Pulling Image ${imageName}: ${error}`);
    }
}

export default pullImage;