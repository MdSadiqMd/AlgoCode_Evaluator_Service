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
        HostConfig: {
            Memory: 1024 * 1024 * 1024,
        },
        OpenStdin: true,
    });
    return container;
}

export default createContainer;