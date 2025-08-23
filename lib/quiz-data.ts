export interface QuizQuestion {
  id: string
  question: string
  code?: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "beginner" | "intermediate" | "advanced"
  topic: string
  points: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  questions: QuizQuestion[]
  totalPoints: number
  timeLimit?: number
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "js-1",
    question: "What will be the output of the following JavaScript code?",
    code: `console.log(typeof null);`,
    options: ["null", "undefined", "object", "boolean"],
    correctAnswer: 2,
    explanation: 'In JavaScript, typeof null returns "object". This is a well-known quirk in the language.',
    difficulty: "beginner",
    topic: "JavaScript Basics",
    points: 10,
  },
  {
    id: "js-2",
    question: "Which method is used to add an element to the end of an array in JavaScript?",
    options: ["append()", "push()", "add()", "insert()"],
    correctAnswer: 1,
    explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
    difficulty: "beginner",
    topic: "JavaScript Arrays",
    points: 10,
  },
  {
    id: "js-3",
    question: "What is the result of the following expression?",
    code: `'5' + 3`,
    options: ["8", "53", "Error", "undefined"],
    correctAnswer: 1,
    explanation: 'JavaScript performs string concatenation when one operand is a string, resulting in "53".',
    difficulty: "beginner",
    topic: "JavaScript Types",
    points: 10,
  },
  {
    id: "py-1",
    question: "What will this Python code output?",
    code: `print([1, 2, 3] * 2)`,
    options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "Error", "[1, 2, 3, 2]"],
    correctAnswer: 1,
    explanation: "The * operator on lists creates a new list by repeating the original list.",
    difficulty: "beginner",
    topic: "Python Lists",
    points: 10,
  },
  {
    id: "py-2",
    question: "Which Python keyword is used to define a function?",
    options: ["function", "def", "func", "define"],
    correctAnswer: 1,
    explanation: 'The "def" keyword is used to define functions in Python.',
    difficulty: "beginner",
    topic: "Python Functions",
    points: 10,
  },
  {
    id: "css-1",
    question: "Which CSS property is used to change the text color?",
    options: ["text-color", "font-color", "color", "text-style"],
    correctAnswer: 2,
    explanation: 'The "color" property is used to set the color of text in CSS.',
    difficulty: "beginner",
    topic: "CSS Styling",
    points: 10,
  },
  {
    id: "html-1",
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
    explanation: "The <a> tag with the href attribute is used to create hyperlinks in HTML.",
    difficulty: "beginner",
    topic: "HTML Elements",
    points: 10,
  },
  {
    id: "js-4",
    question: 'What is the purpose of the "use strict" directive in JavaScript?',
    options: [
      "Makes code run faster",
      "Enables strict mode for better error checking",
      "Imports external libraries",
      "Defines constants",
    ],
    correctAnswer: 1,
    explanation:
      'The "use strict" directive enables strict mode, which catches common coding mistakes and prevents certain actions.',
    difficulty: "intermediate",
    topic: "JavaScript Advanced",
    points: 15,
  },
]

export const quizzes: Quiz[] = [
  {
    id: "beginner-basics",
    title: "Programming Fundamentals",
    description: "Test your knowledge of basic programming concepts across multiple languages",
    difficulty: "beginner",
    questions: quizQuestions.filter((q) => q.difficulty === "beginner"),
    totalPoints: quizQuestions.filter((q) => q.difficulty === "beginner").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 600, // 10 minutes
  },
  {
    id: "intermediate-concepts",
    title: "Intermediate Programming",
    description: "Challenge yourself with more advanced programming concepts",
    difficulty: "intermediate",
    questions: quizQuestions.filter((q) => q.difficulty === "intermediate"),
    totalPoints: quizQuestions.filter((q) => q.difficulty === "intermediate").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 900, // 15 minutes
  },
]
