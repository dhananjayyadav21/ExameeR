
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing with key:", key ? "Key present (" + key.substring(0, 5) + "...)" : "No key found");

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await res.json();
        console.log("Response data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
