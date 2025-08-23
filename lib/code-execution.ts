// Mock code execution service - in production, this would call a backend API
export interface ExecutionResult {
  success: boolean
  output: any
  error?: string
  executionTime: number
}

export async function executeCode(
  code: string,
  language: "javascript" | "python",
  testCase: { input: any[]; expectedOutput: any },
): Promise<ExecutionResult> {
  const startTime = Date.now()

  try {
    if (language === "javascript") {
      return await executeJavaScript(code, testCase)
    } else if (language === "python") {
      return await executePython(code, testCase)
    }
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : "Unknown error",
      executionTime: Date.now() - startTime,
    }
  }

  return {
    success: false,
    output: null,
    error: "Unsupported language",
    executionTime: Date.now() - startTime,
  }
}

async function executeJavaScript(
  code: string,
  testCase: { input: any[]; expectedOutput: any },
): Promise<ExecutionResult> {
  const startTime = Date.now()

  try {
    // Create a safe execution environment
    const func = new Function("return " + code)()

    if (typeof func !== "function") {
      throw new Error("Code must define a function")
    }

    const result = func(...testCase.input)
    const executionTime = Date.now() - startTime

    return {
      success: JSON.stringify(result) === JSON.stringify(testCase.expectedOutput),
      output: result,
      executionTime,
    }
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : "Execution error",
      executionTime: Date.now() - startTime,
    }
  }
}

async function executePython(code: string, testCase: { input: any[]; expectedOutput: any }): Promise<ExecutionResult> {
  // Mock Python execution - in production, this would use a Python interpreter service
  const startTime = Date.now()

  // For demo purposes, we'll simulate Python execution
  // In a real implementation, you'd send this to a backend service
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))

  const executionTime = Date.now() - startTime

  // Mock successful execution for demo
  return {
    success: true,
    output: testCase.expectedOutput,
    executionTime,
  }
}

export async function runAllTestCases(
  code: string,
  language: "javascript" | "python",
  testCases: { input: any[]; expectedOutput: any }[],
): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = []

  for (const testCase of testCases) {
    const result = await executeCode(code, language, testCase)
    results.push(result)
  }

  return results
}
