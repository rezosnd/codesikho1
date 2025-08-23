<img width="1640" height="708" alt="image" src="https://github.com/user-attachments/assets/55c654f4-20f1-4bad-91d8-68901c80a825" /># SIKHOCode 🚀

### A Gamified Cyberpunk Learning Platform for Coders.



SIKHOCode is a futuristic, gamified web application designed to make learning to code an engaging and rewarding experience. Users can level up, earn XP, and unlock achievements by completing interactive quizzes, coding challenges, and mini-games. The platform features a global leaderboard, a personalized AI assistant, and a sleek, cyberpunk-themed user interface.

**Live Demo:** [https://codesikho1.vercel.app/](https://codesikho1.vercel.app/)
<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/29f2fe9f-caee-49e9-840f-553ff321ed8e" />



***

## ## ✨ Features

* ** Gamified Progression:** A complete XP, Level, and Badge system that rewards users for their progress.
* ** Interactive Quizzes:** Timed, multiple-choice quizzes on various topics (JavaScript, Python, HTML/CSS, etc.) with a "Play Again" feature that doesn't award extra XP.
* ** Live Coding Challenges:** An in-browser code editor where users can solve real programming problems and run test cases.
* ** Engaging Mini-Games:** Interactive games (Drag & Drop, Matching, Sequence) to teach programming concepts in a fun way.
* ** Global Leaderboard:** A filterable ranking system where users can compete for the top spots based on XP.
* ** Personalized User Profiles:** A detailed dashboard for users to track their stats, view their unlocked achievements, and monitor their recent activity.
* ** Context-Aware AI Assistant:** An integrated AI chat assistant (powered by Groq) that has access to the user's profile and can provide personalized learning recommendations.
* ** Secure Authentication:** Full email/password and Google Sign-In functionality powered by Firebase Authentication.
* ** Fully Responsive Design:** A sleek, cyberpunk-themed UI that works seamlessly on all devices.
<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/1754db04-b07f-4426-9f51-58a90dbecab8" />
<img width="542" height="787" alt="image" src="https://github.com/user-attachments/assets/b9eb6688-7960-4a82-af41-4d3418d096a8" />

***

## ## 💻 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **AI & Chat:** [Groq](https://groq.com/) & [Vercel AI SDK](https://sdk.vercel.ai/)
* **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
* **Database:** [MongoDB](https://www.mongodb.com/)
* **Deployment:** [Vercel](https://vercel.com/)

***

## ## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later)
* [pnpm](https://pnpm.io/)
* [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/rezosnd/codesikho1.git](https://github.com/rezosnd/codesikho1.git)
    cd codesikho1
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env.local` in the root of your project and add the following variables. You will need to get these keys from their respective services (Firebase, MongoDB, Groq).

    ```env
    # Firebase Public Keys
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

    # Firebase Admin SDK (for server-side)
    FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    FIREBASE_CLIENT_EMAIL="YOUR_CLIENT_EMAIL"
    FIREBASE_PRIVATE_KEY="YOUR_PRIVATE_KEY"

    # MongoDB
    MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"
    MONGODB_DB_NAME="YOUR_DATABASE_NAME"

    # Groq AI
    GROQ_API_KEY="YOUR_GROQ_API_KEY"
    ```

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

***

## ## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
