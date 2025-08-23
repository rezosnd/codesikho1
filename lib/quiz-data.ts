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
  // --- JavaScript Beginner ---
  {
    id: "js-b-1",
    question: "What will be the output of the following JavaScript code?",
    code: `console.log(typeof null);`,
    options: ["null", "undefined", "object", "boolean"],
    correctAnswer: 2,
    explanation: 'In JavaScript, typeof null returns "object". This is a well-known quirk in the language.',
    difficulty: "beginner",
    topic: "JavaScript",
    points: 10,
  },
  {
    id: "js-b-2",
    question: "Which keyword is used to declare a variable that cannot be reassigned?",
    options: ["let", "var", "const", "static"],
    correctAnswer: 2,
    explanation: "The `const` keyword creates a read-only reference to a value, meaning it cannot be reassigned.",
    difficulty: "beginner",
    topic: "JavaScript",
    points: 10,
  },
  {
    id: "js-b-3",
    question: "What is the result of the following expression?",
    code: `'5' + 3`,
    options: ["8", "53", "Error", "undefined"],
    correctAnswer: 1,
    explanation: 'JavaScript performs string concatenation when one operand is a string, resulting in "53".',
    difficulty: "beginner",
    topic: "JavaScript",
    points: 10,
  },

  // --- Python Beginner ---
  {
    id: "py-b-1",
    question: "What will this Python code output?",
    code: `print([1, 2, 3] * 2)`,
    options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "Error", "[1, 2, 3, 2]"],
    correctAnswer: 1,
    explanation: "The * operator on lists creates a new list by repeating the original list.",
    difficulty: "beginner",
    topic: "Python",
    points: 10,
  },
  {
    id: "py-b-2",
    question: "Which Python keyword is used to define a function?",
    options: ["function", "def", "func", "define"],
    correctAnswer: 1,
    explanation: 'The "def" keyword is used to define functions in Python.',
    difficulty: "beginner",
    topic: "Python",
    points: 10,
  },

  // --- HTML/CSS Beginner ---
  {
    id: "css-b-1",
    question: "Which CSS property is used to change the text color?",
    options: ["text-color", "font-color", "color", "text-style"],
    correctAnswer: 2,
    explanation: 'The "color" property is used to set the color of text in CSS.',
    difficulty: "beginner",
    topic: "CSS",
    points: 10,
  },
  {
    id: "html-b-1",
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
    explanation: "The <a> tag with the href attribute is used to create hyperlinks in HTML.",
    difficulty: "beginner",
    topic: "HTML",
    points: 10,
  },
  {
    id: "css-b-2",
    question: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 1,
    explanation: "CSS stands for Cascading Style Sheets, which is used to describe the presentation of a document written in HTML.",
    difficulty: "beginner",
    topic: "CSS",
    points: 10,
  },
  
  // --- JavaScript Intermediate ---
  {
    id: "js-i-1",
    question: 'What is the purpose of the "use strict" directive in JavaScript?',
    options: ["Makes code run faster", "Enables strict mode for better error checking", "Imports external libraries", "Defines constants"],
    correctAnswer: 1,
    explanation: 'The "use strict" directive enables strict mode, which catches common coding mistakes and prevents certain actions.',
    difficulty: "intermediate",
    topic: "JavaScript",
    points: 15,
  },
  {
    id: "js-i-2",
    question: "Which of the following is NOT a JavaScript framework/library?",
    options: ["React", "Angular", "Vue", "Laravel"],
    correctAnswer: 3,
    explanation: "Laravel is a PHP framework, while React, Angular, and Vue are popular JavaScript frameworks/libraries.",
    difficulty: "intermediate",
    topic: "JavaScript",
    points: 15,
  },
  {
    id: "js-i-3",
    question: "What does the `map` method on an array do?",
    options: ["Removes the last element of an array", "Creates a new array with the results of calling a provided function on every element", "Checks if at least one element in the array passes a test", "Joins all elements of an array into a string"],
    correctAnswer: 1,
    explanation: "The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.",
    difficulty: "intermediate",
    topic: "JavaScript",
    points: 15,
  },

  // --- Python Intermediate ---
  {
    id: "py-i-1",
    question: "What is a list comprehension in Python?",
    options: ["A way to create lists using a for loop inside brackets", "A method to check the length of a list", "A special type of comment for lists", "A function that sorts lists automatically"],
    correctAnswer: 0,
    explanation: "List comprehensions offer a concise way to create lists. They consist of brackets containing an expression followed by a for clause.",
    difficulty: "intermediate",
    topic: "Python",
    points: 15,
  },
  {
    id: "py-i-2",
    question: "What is the difference between a list and a tuple in Python?",
    options: ["Lists are mutable, tuples are immutable", "Tuples are mutable, lists are immutable", "There is no difference", "Lists can only store numbers, tuples can store strings"],
    correctAnswer: 0,
    explanation: "The primary difference is that lists are mutable, meaning their elements can be changed, while tuples are immutable.",
    difficulty: "intermediate",
    topic: "Python",
    points: 15,
  },
  
  // --- CSS Intermediate ---
  {
    id: "css-i-1",
    question: "What is the CSS Box Model?",
    options: ["A model for creating 3D shapes", "A box that wraps around every HTML element, consisting of: margins, borders, padding, and the actual content", "A tool for measuring distance on a webpage", "A type of CSS framework"],
    correctAnswer: 1,
    explanation: "The CSS box model is a fundamental concept. It's a box that wraps around every HTML element, and it includes margins, borders, padding, and the content itself.",
    difficulty: "intermediate",
    topic: "CSS",
    points: 15,
  },
  {
    id: "css-i-2",
    question: "What is the difference between Flexbox and Grid?",
    options: ["Flexbox is for 3D layouts, Grid is for 2D", "Flexbox is for one-dimensional layouts (a row or a column), Grid is for two-dimensional layouts (rows and columns)", "Grid is older and Flexbox is newer", "There is no difference"],
    correctAnswer: 1,
    explanation: "The main difference is that Flexbox is designed for one-dimensional layouts (either a row or a column), while Grid is designed for two-dimensional layouts (rows and columns simultaneously).",
    difficulty: "intermediate",
    topic: "CSS",
    points: 20,
  },
  
  // --- JavaScript Advanced ---
  {
    id: "js-a-1",
    question: "What is the event loop in JavaScript?",
    options: ["A `for` loop that never ends", "A JavaScript feature that allows it to perform non-blocking I/O operations", "A way to handle custom events", "A debugging tool"],
    correctAnswer: 1,
    explanation: "The event loop is a mechanism that allows Node.js and browsers to perform non-blocking I/O operations despite the fact that JavaScript is single-threaded.",
    difficulty: "advanced",
    topic: "JavaScript",
    points: 25,
  },
  {
    id: "js-a-2",
    question: "What is the difference between `Promise.all()` and `Promise.race()`?",
    options: ["`all` resolves when all promises resolve, `race` resolves when any promise resolves or rejects", "`race` resolves when all promises resolve, `all` resolves when any promise resolves", "They are the same", "`all` is for arrays, `race` is for objects"],
    correctAnswer: 0,
    explanation: "`Promise.all()` returns a single Promise that fulfills when all of the promises in the iterable argument have fulfilled. `Promise.race()` returns a promise that fulfills or rejects as soon as one of the promises in the iterable fulfills or rejects.",
    difficulty: "advanced",
    topic: "JavaScript",
    points: 30,
  },

  // --- Python Advanced ---
  {
    id: "py-a-1",
    question: "What is a decorator in Python?",
    options: ["A way to add comments to code", "A function that takes another function and extends its behavior without explicitly modifying it", "A method for styling output text", "A type of variable"],
    correctAnswer: 1,
    explanation: "Decorators are a powerful feature in Python that allow programmers to modify the behavior of a function or class.",
    difficulty: "advanced",
    topic: "Python",
    points: 25,
  },
  
  // --- Data Structures Advanced ---
  {
    id: "ds-a-1",
    question: "What is the time complexity of a binary search algorithm?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search has a time complexity of O(log n) because it halves the search space with each comparison, making it very efficient for large sorted arrays.",
    difficulty: "advanced",
    topic: "Data Structures & Algorithms",
    points: 30,
  },
];

export const quizzes: Quiz[] = [
  {
    id: "quiz-js-beginner",
    title: "JavaScript Basics",
    description: "Test your fundamental knowledge of JavaScript variables, types, and operators.",
    difficulty: "beginner",
    questions: quizQuestions.filter((q) => q.topic === "JavaScript" && q.difficulty === "beginner"),
    totalPoints: quizQuestions.filter((q) => q.topic === "JavaScript" && q.difficulty === "beginner").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 300, // 5 minutes
  },
  {
    id: "quiz-py-beginner",
    title: "Python Fundamentals",
    description: "A great starting point to test your basic Python syntax and data structures.",
    difficulty: "beginner",
    questions: quizQuestions.filter((q) => q.topic === "Python" && q.difficulty === "beginner"),
    totalPoints: quizQuestions.filter((q) => q.topic === "Python" && q.difficulty === "beginner").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 300, // 5 minutes
  },
  {
    id: "quiz-webdev-basics",
    title: "Web Dev Basics",
    description: "Cover the essential tags and properties of HTML and CSS.",
    difficulty: "beginner",
    questions: quizQuestions.filter((q) => (q.topic === "HTML" || q.topic === "CSS") && q.difficulty === "beginner"),
    totalPoints: quizQuestions.filter((q) => (q.topic === "HTML" || q.topic === "CSS") && q.difficulty === "beginner").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 420, // 7 minutes
  },
  {
    id: "quiz-js-intermediate",
    title: "JavaScript Intermediate",
    description: "Dive deeper into JavaScript with questions on frameworks, methods, and strict mode.",
    difficulty: "intermediate",
    questions: quizQuestions.filter((q) => q.topic === "JavaScript" && q.difficulty === "intermediate"),
    totalPoints: quizQuestions.filter((q) => q.topic === "JavaScript" && q.difficulty === "intermediate").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 600, // 10 minutes
  },
  {
    id: "quiz-css-intermediate",
    title: "CSS Layout Mastery",
    description: "Test your understanding of modern CSS layouts with the Box Model, Flexbox, and Grid.",
    difficulty: "intermediate",
    questions: quizQuestions.filter((q) => q.topic === "CSS" && q.difficulty === "intermediate"),
    totalPoints: quizQuestions.filter((q) => q.topic === "CSS" && q.difficulty === "intermediate").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 480, // 8 minutes
  },
  {
    id: "quiz-py-intermediate",
    title: "Python Intermediate",
    description: "Challenge your Python skills with list comprehensions and object-oriented concepts.",
    difficulty: "intermediate",
    questions: quizQuestions.filter((q) => q.topic === "Python" && q.difficulty === "intermediate"),
    totalPoints: quizQuestions.filter((q) => q.topic === "Python" && q.difficulty === "intermediate").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 600, // 10 minutes
  },
  {
    id: "quiz-js-advanced",
    title: "JavaScript Advanced",
    description: "Explore the asynchronous nature of JavaScript, including the event loop and promises.",
    difficulty: "advanced",
    questions: quizQuestions.filter((q) => q.topic === "JavaScript" && q.difficulty === "advanced"),
    totalPoints: quizQuestions.filter((q) => q.topic === "JavaScript" && q.difficulty === "advanced").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 720, // 12 minutes
  },
  {
    id: "quiz-ds-advanced",
    title: "Algorithms & Data Structures",
    description: "Assess your knowledge of core computer science concepts like time complexity.",
    difficulty: "advanced",
    questions: quizQuestions.filter((q) => q.topic === "Data Structures & Algorithms" && q.difficulty === "advanced"),
    totalPoints: quizQuestions.filter((q) => q.topic === "Data Structures & Algorithms" && q.difficulty === "advanced").reduce((sum, q) => sum + q.points, 0),
    timeLimit: 300, // 5 minutes
  },
];
