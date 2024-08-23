export default interface codeExecutorStrategy {
    execute(code: string, inputTestCase: string[], outputTestCase: string[]): Promise<ExecutionResponse>;
}

export type ExecutionResponse = { output: string, status: string; };