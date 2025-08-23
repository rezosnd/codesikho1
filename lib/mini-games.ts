export interface MiniGame {
  id: string
  title: string
  description: string
  type: "drag-drop" | "matching" | "sequence" | "puzzle"
  difficulty: "easy" | "medium" | "hard"
  topic: string
  points: number
  timeLimit?: number
}

export interface DragDropGame extends MiniGame {
  type: "drag-drop"
  codeBlocks: {
    id: string
    code: string
    type: "correct" | "incorrect" | "distractor"
  }[]
  correctSequence: string[]
  explanation: string
}

export interface MatchingGame extends MiniGame {
  type: "matching"
  pairs: {
    id: string
    left: string
    right: string
    explanation: string
  }[]
}

export interface SequenceGame extends MiniGame {
  type: "sequence"
  items: {
    id: string
    content: string
    correctPosition: number
  }[]
  explanation: string
}

export const miniGames: (DragDropGame | MatchingGame | SequenceGame)[] = [
  {
    id: "function-builder",
    title: "Function Builder",
    description: "Drag and drop code blocks to build a working function",
    type: "drag-drop",
    difficulty: "easy",
    topic: "Functions",
    points: 25,
    timeLimit: 300,
    codeBlocks: [
      { id: "1", code: "function calculateSum(a, b) {", type: "correct" },
      { id: "2", code: "  return a + b;", type: "correct" },
      { id: "3", code: "}", type: "correct" },
      { id: "4", code: "console.log('Hello');", type: "distractor" },
      { id: "5", code: "  return a - b;", type: "incorrect" },
      { id: "6", code: "let x = 5;", type: "distractor" },
    ],
    correctSequence: ["1", "2", "3"],
    explanation: "A function needs a declaration, implementation, and closing brace in the correct order.",
  },
  {
    id: "loop-concepts",
    title: "Loop Master",
    description: "Match loop types with their use cases",
    type: "matching",
    difficulty: "medium",
    topic: "Loops",
    points: 30,
    timeLimit: 240,
    pairs: [
      {
        id: "1",
        left: "for loop",
        right: "Known number of iterations",
        explanation: "For loops are best when you know exactly how many times to repeat",
      },
      {
        id: "2",
        left: "while loop",
        right: "Condition-based repetition",
        explanation: "While loops continue as long as a condition is true",
      },
      {
        id: "3",
        left: "do-while loop",
        right: "Execute at least once",
        explanation: "Do-while loops always execute the body at least once before checking the condition",
      },
      {
        id: "4",
        left: "forEach",
        right: "Array iteration",
        explanation: "forEach is specifically designed for iterating over array elements",
      },
    ],
  },
  {
    id: "algorithm-steps",
    title: "Algorithm Sequencer",
    description: "Put the algorithm steps in the correct order",
    type: "sequence",
    difficulty: "medium",
    topic: "Algorithms",
    points: 35,
    timeLimit: 180,
    items: [
      { id: "1", content: "Initialize variables", correctPosition: 0 },
      { id: "2", content: "Check base case", correctPosition: 1 },
      { id: "3", content: "Process current element", correctPosition: 2 },
      { id: "4", content: "Make recursive call", correctPosition: 3 },
      { id: "5", content: "Return result", correctPosition: 4 },
    ],
    explanation: "Recursive algorithms follow this pattern: initialize, check base case, process, recurse, return.",
  },
  {
    id: "variable-scope",
    title: "Scope Detective",
    description: "Match variables with their correct scope",
    type: "matching",
    difficulty: "hard",
    topic: "Scope",
    points: 40,
    timeLimit: 300,
    pairs: [
      {
        id: "1",
        left: "let x = 5; (inside function)",
        right: "Function scope",
        explanation: "Variables declared with let inside a function have function scope",
      },
      {
        id: "2",
        left: "var y = 10; (outside all functions)",
        right: "Global scope",
        explanation: "Variables declared with var outside functions have global scope",
      },
      {
        id: "3",
        left: "const z = 15; (inside if block)",
        right: "Block scope",
        explanation: "Variables declared with const inside blocks have block scope",
      },
      {
        id: "4",
        left: "function parameter",
        right: "Function scope",
        explanation: "Function parameters are scoped to the function they're declared in",
      },
    ],
  },
  {
    id: "array-methods",
    title: "Array Method Matcher",
    description: "Match array methods with their purposes",
    type: "matching",
    difficulty: "easy",
    topic: "Arrays",
    points: 20,
    timeLimit: 200,
    pairs: [
      {
        id: "1",
        left: "push()",
        right: "Add element to end",
        explanation: "push() adds one or more elements to the end of an array",
      },
      {
        id: "2",
        left: "pop()",
        right: "Remove last element",
        explanation: "pop() removes and returns the last element from an array",
      },
      {
        id: "3",
        left: "shift()",
        right: "Remove first element",
        explanation: "shift() removes and returns the first element from an array",
      },
      {
        id: "4",
        left: "unshift()",
        right: "Add element to beginning",
        explanation: "unshift() adds one or more elements to the beginning of an array",
      },
    ],
  },
]
