import codeExecutorStrategy from "../containers/codeExecutorStrategy.container";
import CppExecutor from "../containers/CppExecutorcontainer";
import JavaExecutor from "../containers/JavaExecutor.container";
import PythonExecutor from "../containers/PythonExecutor.container";

function createExecutor(language: string): codeExecutorStrategy {
    switch (language) {
        case 'CPP':
            return new CppExecutor();
        case 'JAVA':
            return new JavaExecutor();
        case 'PYTHON':
            return new PythonExecutor();
        default:
            throw new Error(`Language ${language} is not supported`);
    }
}

export default createExecutor;
