import mongoose from 'mongoose';
import connectToMongo from '../lib/mongodb.js';
import Note from '../models/Note.js';

async function check() {
    await connectToMongo();
    const notes = await Note.find({ semester: { $ne: "" } });
    console.log(`Found ${notes.length} notes with semester`);
    console.log(JSON.stringify(notes.map(n => ({
        id: n._id,
        title: n.title,
        semester: n.semester
    })), null, 2));
    process.exit(0);
}

check();
