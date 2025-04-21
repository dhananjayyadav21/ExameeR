const Note = require('../model/notesModel');
const userModel = require("../model/User");


// ============================ [ uplodeNotes Controller ] ===============================
const uploadNotes = async (req, res) => {
  try {

    let userId = req.user._id;
    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found !',
      })
    }

    // check user role 
    if (user.Role !== "Admin" && user.Role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to upload notes!",
      })
    }

    const { title, description, professor, category, tags, isPublic, status, fileUrl } = req.body;

    // Check All data from body
    if (!title || !professor) {
      return res.status(400).json({
        success: false,
        message: "Notes title & professor must be important !"
      });
    }

    // Check All data from body
    if (!category || !status ) {
      return res.status(400).json({
        success: false,
        message: "Notes Category & Status reuired !"
      });
    }

    // Check All data from body
    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File not uplode try again!"
      });
    }

    const newNote = new Note({ //create notes
      title,
      description,
      professor,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      isPublic: isPublic === 'false' ? false : true,
      status: status || 'public',
      fileUrl,
      uploadedBy: userId,
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null
    });

    await newNote.save(); // save notes in db
    let note = {
      title,
      description,
      professor,
      category,
    }

    return res.status(201).json({ // send result as true
      success: true,
      message: 'Note uploaded successfully',
      note
    })

  } catch (error) { // if accuerd error
    console.error('Upload Note Error:', error);
    return res.status(201).json({
      success: false,
      message: 'Server error while uploading note!',
    })
  }
};

// ------[Get all public notes ] -----------------
const getAllPublicNotes = async (req, res) => {

  try {
    let userId = req.user._id;
    const category = (req.query.category !== undefined && req.query.category !== null) 
    ? req.query.category 
    : "sciTechnology";
    
    const sortBy = (req.query.sortBy !== undefined && req.query.sortBy !== null) 
    ? req.query.sortBy 
    : "latest";

    let sortOption = {};
    if (sortBy === "latest") {
      sortOption = { createdOn: -1 }; // Newest first
    } else if (sortBy === "oldest") {
      sortOption = { createdOn: 1 }; // Oldest first
    } 

    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found !',
      })
    }

    if(user.Role === "Student"){
      const notes = await Note.find({ // all notes find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption);
  
      res.status(200).json({ // return result as true
        success: true,
        message:"Fetch All Public Notes ",
        count: notes.length,
        data: notes,
      });
    }
    
    if(user.Role === "Instructor"){
      const notes = await Note.find({
        $or: [
          { isPublic: true, status: 'public',category: category },  // public notes
          { uploadedBy: req.user._id } // my notes (any status)
        ]
      }).sort(sortOption);

      res.status(200).json({ // return result as true
        success: true,
        message:"Fetch All My & Public Notes ",
        count: notes.length,
        data: notes,
      });
    }
  
    if(user.Role === "Admin"){
      const notes = await Note.find({category: category}).sort(sortOption); // all notes find from db
  
      res.status(200).json({ // return result as true
        success: true,
        message:"Fetch All Notes ",
        count: notes.length,
        data: notes,
      });
    }
  } catch (error) { // if accured some error
    console.error('Error fetching public notes:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching public notes',
    });
  }
};


module.exports = { uploadNotes, getAllPublicNotes }