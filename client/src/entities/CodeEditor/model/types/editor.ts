export interface CompilationError {
    errorCode: string;
    message: string;
    startChar: number;
    endChar: number;
    startLine: number;
    endLine: number;
}

export interface TestsRunResponse {
    isCompiledSuccessfully?: boolean;
    failedTestCases?: Map<string, string>;
    passedTestCases?: string[];
}

export interface ExecutionResult {
    success: boolean;
    output: string[];
    errors: CompilationError[];
}

export interface TestsRunResponse {
    isCompiledSuccessfully?: boolean;
    failedTestCases?: Map<string, string>;
    passedTestCases?: string[];
}
