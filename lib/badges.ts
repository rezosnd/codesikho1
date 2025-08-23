export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  // The metric used to track progress toward this badge
  requirement: {
    type: "xp" | "level" | "quizzes_completed" | "coding_challenges_completed" | "perfect_scores" | "streak";
    value: number;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const badges: Badge[] = [
  // --- Onboarding & First Steps ---
  {
    id: "first_quiz",
    name: "First Transmission",
    description: "Complete your first quiz.",
    icon: "📡",
    requirement: { type: "quizzes_completed", value: 1 },
    rarity: "common",
  },
  {
    id: "first_challenge",
    name: "Code Warrior",
    description: "Solve your first coding challenge.",
    icon: "⚔️",
    rarity: "common",
    requirement: { type: "coding_challenges_completed", value: 1 },
  },
  {
    id: "xp_earner",
    name: "XP Earner",
    description: "Earn 1,000 total XP.",
    icon: "✨",
    requirement: { type: "xp", value: 1000 },
    rarity: "common",
  },
  {
    id: "level_5",
    name: "Level 5 Operative",
    description: "Reach Level 5.",
    icon: "📈",
    requirement: { type: "level", value: 5 },
    rarity: "common",
  },

  // --- Quiz Milestones ---
  {
    id: "quiz_adept",
    name: "Quiz Adept",
    description: "Successfully complete 10 quizzes.",
    icon: "🎓",
    requirement: { type: "quizzes_completed", value: 10 },
    rarity: "rare",
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Successfully complete 25 quizzes.",
    icon: "👑",
    requirement: { type: "quizzes_completed", value: 25 },
    rarity: "epic",
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Get a perfect 100% score on any quiz.",
    icon: "⭐",
    requirement: { type: "perfect_scores", value: 1 },
    rarity: "rare",
  },

  // --- Coding Challenge Milestones ---
  {
    id: "algorithm_ace",
    name: "Algorithm Ace",
    description: "Solve 5 coding challenges.",
    icon: "💻",
    requirement: { type: "coding_challenges_completed", value: 5 },
    rarity: "rare",
  },
  {
    id: "bug_hunter",
    name: "Bug Hunter",
    description: "Solve 15 coding challenges.",
    icon: "🐞",
    requirement: { type: "coding_challenges_completed", value: 15 },
    rarity: "epic",
  },

  // --- XP & Level Milestones ---
  {
    id: "xp_hoarder",
    name: "XP Hoarder",
    description: "Accumulate 10,000 total XP.",
    icon: "💰",
    requirement: { type: "xp", value: 10000 },
    rarity: "epic",
  },
  {
    id: "level_10",
    name: "Level 10 Veteran",
    description: "Reach Level 10.",
    icon: "🚀",
    requirement: { type: "level", value: 10 },
    rarity: "rare",
  },
  {
    id: "level_25_elite",
    name: "Level 25 Elite",
    description: "Reach the prestigious Level 25.",
    icon: "🌟",
    requirement: { type: "level", value: 25 },
    rarity: "epic",
  },
  {
    id: "grid_legend",
    name: "Grid Legend",
    description: "Accumulate 50,000 total XP.",
    icon: "💎",
    requirement: { type: "xp", value: 50000 },
    rarity: "legendary",
  },
];
