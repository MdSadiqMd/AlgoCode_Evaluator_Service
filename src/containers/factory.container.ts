import Docker from 'dockerode';

async function createContainer(imageName: string, cmdExecutable: string[]) {
    const docker = new Docker();

    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        OpenStdin: true,
    });
    return container;
}

export default createContainer;