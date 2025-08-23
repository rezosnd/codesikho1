export interface TestCase {
  input: any[]
  expectedOutput: any
  description?: string
}

export interface CodingChallenge {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
  points: number
  timeLimit?: number
  starterCode: {
    javascript: string
    python: string
  }
  testCases: TestCase[]
  hints: string[]
  solution: {
    javascript: string
    python: string
  }
}

export const codingChallenges: CodingChallenge[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    difficulty: "easy",
    topic: "Arrays",
    points: 50,
    timeLimit: 1800, // 30 minutes
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
    },
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        expectedOutput: [0, 1],
        description: "Basic case: [2,7,11,15], target 9",
      },
      {
        input: [[3, 2, 4], 6],
        expectedOutput: [1, 2],
        description: "Case: [3,2,4], target 6",
      },
      {
        input: [[3, 3], 6],
        expectedOutput: [0, 1],
        description: "Duplicate numbers: [3,3], target 6",
      },
    ],
    hints: [
      "Think about using a hash map to store numbers you've seen",
      "For each number, check if target - number exists in your hash map",
      "Don't forget to return the indices, not the values",
    ],
    solution: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
      python: `def two_sum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []`,
    },
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]`,
    difficulty: "easy",
    topic: "Strings",
    points: 30,
    timeLimit: 900, // 15 minutes
    starterCode: {
      javascript: `function reverseString(s) {
    // Your code here
    
}`,
      python: `def reverse_string(s):
    # Your code here
    pass`,
    },
    testCases: [
      {
        input: [["h", "e", "l", "l", "o"]],
        expectedOutput: ["o", "l", "l", "e", "h"],
        description: 'Basic case: ["h","e","l","l","o"]',
      },
      {
        input: [["H", "a", "n", "n", "a", "h"]],
        expectedOutput: ["h", "a", "n", "n", "a", "H"],
        description: 'Case: ["H","a","n","n","a","h"]',
      },
    ],
    hints: [
      "Use two pointers approach - one at start, one at end",
      "Swap characters and move pointers towards center",
      "Continue until pointers meet in the middle",
    ],
    solution: {
      javascript: `function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
    
    return s;
}`,
      python: `def reverse_string(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    
    return s`,
    },
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number",
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.

Given n, calculate F(n).

Example:
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.`,
    difficulty: "easy",
    topic: "Dynamic Programming",
    points: 40,
    timeLimit: 1200, // 20 minutes
    starterCode: {
      javascript: `function fib(n) {
    // Your code here
    
}`,
      python: `def fib(n):
    # Your code here
    pass`,
    },
    testCases: [
      {
        input: [2],
        expectedOutput: 1,
        description: "F(2) = 1",
      },
      {
        input: [3],
        expectedOutput: 2,
        description: "F(3) = 2",
      },
      {
        input: [4],
        expectedOutput: 3,
        description: "F(4) = 3",
      },
      {
        input: [10],
        expectedOutput: 55,
        description: "F(10) = 55",
      },
    ],
    hints: [
      "You can solve this recursively, but it's inefficient",
      "Try using dynamic programming with bottom-up approach",
      "You only need to keep track of the last two numbers",
    ],
    solution: {
      javascript: `function fib(n) {
    if (n <= 1) return n;
    
    let prev = 0, curr = 1;
    
    for (let i = 2; i <= n; i++) {
        let temp = curr;
        curr = prev + curr;
        prev = temp;
    }
    
    return curr;
}`,
      python: `def fib(n):
    if n <= 1:
        return n
    
    prev, curr = 0, 1
    
    for i in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr`,
    },
  },
]
