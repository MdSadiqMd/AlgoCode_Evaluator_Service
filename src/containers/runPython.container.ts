/* import Docker from 'dockerode';

import { TestCases } from '../types/testCases.types'; */
import createContainer from './factory.container';
import { PYTHON_IMAGE } from '../utils/constants.utils';
import logger from '../config/logger.config';

async function runPython(code: string) {
    logger.info(`Initialising Python Docker Container`);
    const pythonContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    await pythonContainer.start();
    logger.info(`Started Python Docker Container`);
    return pythonContainer;
}

export default runPython;