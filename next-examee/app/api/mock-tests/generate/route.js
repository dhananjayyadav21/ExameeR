import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Users from '@/models/User';
import MockTest from '@/models/MockTest';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectToMongo();
        const { token, mode, topic } = await req.json();

        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        const userId = decoded._id;

        const user = await Users.findById(userId);
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        const isPractice = mode === 'practice';
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return NextResponse.json({ success: false, message: "AI Configuration missing. Please contact admin." }, { status: 500 });
        }

        const numQ = isPractice ? 10 : 15;
        const difficulty = isPractice ? "Adaptive" : "Hard";

        const prompt = `
            As an elite AI examiner for Examee, generate a professional mock test for a student with the following profile:
            - University: ${user.University || 'Global Standard'}
            - Course: ${user.Course || 'Advanced Studies'}
            - Semester: ${user.Semester || 'Final Year'}
            - PRIMARY TOPIC/SUBJECT FOR THIS TEST: ${topic}
            
            TASK: Generate exactly ${numQ} high-quality multiple-choice questions.
            
            CRITICAL GUIDELINES:
            1. Every question MUST be strictly relevant to the TOPIC: "${topic}".
            2. Difficulty should be "${difficulty}". 
            3. Ensure options are professional and challenge the student's understanding.
            4. Each question needs a detailed educational explanation.

            REQUIRED JSON FORMAT (Array of objects only, no extra text):
            [
              {
                "questionText": "The question content here?",
                "options": ["Correct Answer", "Option 2", "Option 3", "Option 4"],
                "correctAnswerIndex": 0,
                "explanation": "Scientific/Logical explanation for why the answer is correct."
              }
            ]
        `;

        console.log(`[LIVE TRACE] Gemini AI: Architecting ${numQ} questions for ${user.Username} on: ${topic}`);

        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const aiData = await aiResponse.json();
        let generatedQuestions = [];

        if (aiData.candidates && aiData.candidates[0]?.content?.parts[0]?.text) {
            const aiText = aiData.candidates[0].content.parts[0].text;
            console.log(`[LIVE TRACE] Gemini Raw Response Length: ${aiText.length}`);

            try {
                const parsed = JSON.parse(aiText);
                generatedQuestions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
            } catch (pErr) {
                console.warn("[LIVE TRACE] JSON Parse failed, attempting regex extraction...");
                const jsonMatch = aiText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    try {
                        generatedQuestions = JSON.parse(jsonMatch[0]);
                    } catch (e2) {
                        console.error("[LIVE TRACE] Extraction failed:", e2.message);
                    }
                }
            }
        } else if (aiData.error) {
            console.error("[LIVE TRACE] Gemini API Error:", aiData.error);
            throw new Error(aiData.error.message || "AI API Error");
        }

        if (!generatedQuestions || generatedQuestions.length === 0) {
            console.error("[LIVE TRACE] Final Questions Array is empty. Raw AI Output was:", aiData.candidates?.[0]?.content?.parts?.[0]?.text);
            throw new Error("AI structure invalid. Technical Check ID: GC-77");
        }

        // Save to DB so student can actually take it
        const newMockTest = new MockTest({
            title: `${topic} - AI Master Mock`,
            description: `AI-Generated assessment for ${topic}. Contextualized for ${user.University || 'your university'} curriculum.`,
            category: user.Category || 'Personalized AI',
            course: user.Course,
            semester: user.Semester,
            difficulty: "Adaptive",
            durationMinutes: isPractice ? 30 : 45,
            totalQuestions: generatedQuestions.length,
            questions: generatedQuestions,
            createdBy: user._id,
            isPublished: true,
            isAI: true // Custom flag for AI generated tests
        });

        await newMockTest.save();

        return NextResponse.json({
            success: true,
            test: newMockTest,
            message: "AI has successfully generated your personalized mock test."
        }, { status: 200 });

    } catch (error) {
        console.error("AI Mock Gen Error:", error);
        return NextResponse.json({ success: false, message: "AI Engine is busy. Please try again in a few moments." }, { status: 500 });
    }
}
