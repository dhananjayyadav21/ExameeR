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

    if (user.Role !== "Admin" && user.Role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to upload notes!",
      })
    }

    const { title, description, professor, category, tags, isPublic, status, fileUrl } = req.body;

    // Check All data from body
    if (!title || !description || !professor || !category || !tags || !status || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Every fields are reuired !"
      });
    }

    const newNote = new Note({
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

    await newNote.save();
    let note = {
      title,
      professor,
      category
    }

    return res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      note
    })

  } catch (error) {
    console.error('Upload Note Error:', error);
    return res.status(201).json({
      success: false,
      message: 'Server error while uploading note!',
    })
  }
};

module.exports = { uploadNotes }