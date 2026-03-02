import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MockTest from '@/models/MockTest';
import Users from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectToMongo();
        const body = await req.json();
        const { token, title, description, category, course, semester, difficulty, durationMinutes, totalQuestions, questions, preview } = body;

        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);

        const user = await Users.findById(decoded._id);
        const validRoles = ['admin', 'Admin', 'instructor', 'Instructor'];
        if (!user || !validRoles.includes(user.Role)) {
            return NextResponse.json({ success: false, message: "Only Admin or Instructor can create mock tests." }, { status: 403 });
        }

        let generatedQuestions = questions;

        // --- AI Question Generation ---
        if (!generatedQuestions || generatedQuestions.length === 0) {
            const numQ = parseInt(totalQuestions) || 5;
            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

            if (GEMINI_API_KEY) {
                console.log("Gemini AI: Architecting assessment using gemini-2.0-flash-lite for topic:", title);
                try {
                    const prompt = `
                        As an expert examiner, generate exactly ${numQ} high-quality multiple-choice questions for a professional mock test.
                        
                        PRIMARY SUBJECT (Title): ${title}
                        SPECIFIC FOCUS & INSTRUCTIONS (Description): ${description}
                        TARGET DIFFICULTY: ${difficulty}
                        
                        CRITICAL GUIDELINES:
                        1. Every question MUST be directly relevant to the PRIMARY SUBJECT.
                        2. Incorporate specific concepts mentioned in the SPECIFIC FOCUS. 
                        3. Ensure options are plausible but distinct.
                        4. Each question needs a clear, educational explanation.
                        5. Difficulty level should be strictly observed as "${difficulty}".

                        REQUIRED JSON FORMAT (Array only, no extra text):
                        [
                          {
                            "questionText": "The question content here?",
                            "options": ["Accurate Option", "Plausible Distractor 1", "Plausible Distractor 2", "Plausible Distractor 3"],
                            "correctAnswerIndex": 0,
                            "explanation": "Scientific/Logical explanation for why the answer is correct."
                          }
                        ]
                    `;

                    // Using gemini-2.0-flash-lite as it was verified available in your account discovery logs
                    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });

                    const aiData = await aiResponse.json();

                    if (aiData.error) {
                        if (aiData.error.status === "RESOURCE_EXHAUSTED") {
                            console.error("Gemini AI: Quota Error (429). The free limit for Lite model might be exhausted or not yet active.");
                        } else {
                            console.error("Gemini AI: API error detail:", JSON.stringify(aiData.error, null, 2));
                        }
                    } else if (aiData.candidates) {
                        const aiText = aiData.candidates[0].content.parts[0].text;
                        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
                        if (jsonMatch) {
                            generatedQuestions = JSON.parse(jsonMatch[0]);
                            console.log(`Gemini AI: Successfully generated ${generatedQuestions.length} questions.`);
                        }
                    }
                } catch (aiErr) {
                    console.error("Gemini Critical Error:", aiErr);
                }
            }
            else {
                console.warn("Gemini AI: API Key missing, using simulation mode.");
            }

            // Fallback Simulation
            if (!generatedQuestions || generatedQuestions.length === 0) {
                generatedQuestions = [];
                for (let i = 0; i < numQ; i++) {
                    generatedQuestions.push({
                        questionText: `Simulated Question about ${title} #${i + 1}?`,
                        options: ["Option A", "Option B", "Option C", "None"],
                        correctAnswerIndex: 0,
                        marks: 1,
                        explanation: "Explanation placeholder."
                    });
                }
            }
        }

        if (preview) {
            return NextResponse.json({ success: true, questions: generatedQuestions }, { status: 200 });
        }

        let mockTest;
        const testId = body._id || body.id;

        if (testId) {
            mockTest = await MockTest.findById(testId);
            if (!mockTest) return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });

            mockTest.title = title;
            mockTest.description = description;
            mockTest.category = category || course || 'General';
            mockTest.course = course;
            mockTest.semester = semester;
            mockTest.difficulty = difficulty;
            mockTest.durationMinutes = durationMinutes;
            mockTest.totalQuestions = generatedQuestions.length;
            mockTest.questions = generatedQuestions;
            mockTest.isPublished = true;
        } else {
            mockTest = new MockTest({
                title,
                description,
                category: category || course || 'General',
                course,
                semester,
                difficulty,
                durationMinutes,
                totalQuestions: generatedQuestions.length,
                questions: generatedQuestions,
                createdBy: user._id,
                isPublished: true,
            });
        }

        await mockTest.save();
        return NextResponse.json({ success: true, message: testId ? "Mock test updated successfully" : "Mock test published successfully", test: mockTest }, { status: testId ? 200 : 201 });

    } catch (error) {
        console.error("Mock Test Processing Error:", error);
        return NextResponse.json({ success: false, message: "Failed to process mock test" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectToMongo();
        const url = new URL(req.url);
        const filterStr = url.searchParams.get('filter'); // 'instructor' or 'all'

        let query = {}; // define query
        // add logic depending on filterStr if needed later

        const testList = await MockTest.find(query).select('-questions').populate('createdBy', 'FirstName LastName').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, tests: testList }, { status: 200 });

    } catch (error) {
        console.error("Fetch Mock Tests Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch mock tests" }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        await connectToMongo();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { token } = await req.json();

        if (!token || !id) return NextResponse.json({ success: false, message: "Unauthorized or missing ID" }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);

        const user = await Users.findById(decoded._id);
        const validRoles = ['admin', 'Admin', 'instructor', 'Instructor'];
        if (!user || !validRoles.includes(user.Role)) {
            return NextResponse.json({ success: false, message: "Unauthorized role" }, { status: 403 });
        }

        await MockTest.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Mock test deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Delete Mock Test Error:", error);
        return NextResponse.json({ success: false, message: "Failed to delete test" }, { status: 500 });
    }
}
