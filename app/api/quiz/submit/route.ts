import { type NextRequest, NextResponse } from "next/server";

import { getUsersCollection, getQuizResultsCollection, getUserActivityCollection } from "@/lib/mongodb";



// Helper function to define your leveling curve.

const getXPForLevel = (level: number): number => {

  return (level - 1) * 1000;

};



export async function POST(request: NextRequest) {

  try {

    const { uid, quizId, score, totalQuestions, answers, timeSpent } = await request.json();



    const usersCollection = await getUsersCollection();

    const quizResultsCollection = await getQuizResultsCollection();

    const activityCollection = await getUserActivityCollection();



    const user = await usersCollection.findOne({ uid });

    if (!user) {

      return NextResponse.json({ error: "User not found" }, { status: 404 });

    }



    const currentXp = user.xp || 0;

    const currentLevel = user.level || 1;

    const xpGained = score * 10;

    const newTotalXp = currentXp + xpGained;



    let newLevel = currentLevel;

    while (newTotalXp >= getXPForLevel(newLevel + 1)) {

      newLevel++; // Level up!

    }

    

    // Save the quiz result first

    await quizResultsCollection.insertOne({

      uid, quizId, score, totalQuestions, answers, timeSpent, completedAt: new Date(),

    });



    // Prepare the data to update the user document

    const updateData: { $inc: { xp: number }; $addToSet: { completedChallenges: string }; $set?: { level: number } } = {

      $inc: { xp: xpGained },

      $addToSet: { completedChallenges: quizId },

    };



    // Only set the new level if it has actually changed

    if (newLevel > currentLevel) {

      updateData.$set = { level: newLevel };



      // --- THIS IS THE CRUCIAL FIX ---

      // Log the 'level_up' activity, including the newLevel.

      // This is what was missing from the code you sent.

      await activityCollection.insertOne({

        uid,

        type: "level_up",

        details: {

          newLevel: newLevel,

          oldLevel: currentLevel,

        },

        timestamp: new Date(),

      });

    }



    // Update the user document in the database

    await usersCollection.updateOne({ uid }, updateData);



    // Always log that a quiz was completed

    await activityCollection.insertOne({

      uid,

      type: "quiz_completed",

      details: { quizId, score, xpGained },

      timestamp: new Date(),

    });



    return NextResponse.json({

      success: true,

      xpGained,

      newXp: newTotalXp,

      leveledUp: newLevel > currentLevel,

      newLevel: newLevel,

    });

  } catch (error) {

    console.error("Error submitting quiz:", error);

    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });

  }

}
