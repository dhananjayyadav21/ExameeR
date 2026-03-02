import mongoose from 'mongoose';
import connectToMongo from '../lib/mongodb.js';
import Note from '../models/Note.js';

async function check() {
    await connectToMongo();
    const notes = await Note.find({}).limit(5);
    console.log(JSON.stringify(notes.map(n => ({
        id: n._id,
        title: n.title,
        course: n.course,
        semester: n.semester,
        university: n.university
    })), null, 2));
    process.exit(0);
}

check();
