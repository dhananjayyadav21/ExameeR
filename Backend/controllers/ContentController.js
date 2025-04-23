const Note = require('../model/notesModel');
const userModel = require("../model/User");
const PYQModel = require("../model/pyqModel");
const VideoModel = require("../model/videoModel");


//-----[ NOTES: uplodeNotes Controller ] ------------
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

    const ExmeeUserId = user.ExmeeUserId;
    const { title, description, professor, category, tags, isPublic, status, fileUrl } = req.body;

    // Check All data from body
    if (!title || !professor) {
      return res.status(400).json({
        success: false,
        message: "Notes title & professor must be important !"
      });
    }

    // Check All data from body
    if (!category || !status) {
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
      ExmeeUserId: ExmeeUserId,
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
      data : note
    })

  } catch (error) { // if accuerd error
    console.error('Upload Note Error:', error);
    return res.status(201).json({
      success: false,
      message: 'Server error while uploading note!',
    })
  }
};

//-----[ PYQ: uplodePYQ Controller ] --------
const uploadPYQ = async (req, res) => {
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
        message: "You are not allowed to upload PYQ!",
      })
    }

    const ExmeeUserId = user.ExmeeUserId;
    const { title, year, subject, category, tags, isPublic, status, fileUrl } = req.body;

    // Check All data from body
    if (!title || !year || !subject) {
      return res.status(400).json({
        success: false,
        message: "PYQ title & year,subject must be important !"
      });
    }

    // Check All data from body
    if (!category || !status) {
      return res.status(400).json({
        success: false,
        message: "PYQ Category & Status reuired !"
      });
    }

    // Check All data from body
    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File not uplode try again!"
      });
    }

    const newPYQ = new PYQModel({ //create pyq
      title, 
      year,
      subject,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      isPublic: isPublic === 'false' ? false : true,
      status: status || 'public',
      fileUrl,
      uploadedBy: userId,
      ExmeeUserId: ExmeeUserId,
    });

    await newPYQ.save(); // save PYQ in db
    let PYQ = {
      title,
      year,
      subject,
      category,
    }

    return res.status(201).json({ // send result as true
      success: true,
      message: 'PYQ uploaded successfully',
      data: PYQ
    })

  } catch (error) { // if accuerd error
    console.error('Upload PYQ Error:', error);
    return res.status(201).json({
      success: false,
      message: 'Server error while uploading pyq!',
    })
  }
};

//------[ VIDEO: uploadVideo Controller ] ---------
const uploadVideo = async (req, res) => {
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
        message: "You are not allowed to upload Video lectures!",
      })
    }

    const ExmeeUserId = user.ExmeeUserId;
    const { title, description, category, tags, isPublic, status, fileUrl } = req.body;

    // Check All data from body
    if (!title) {
      return res.status(206).json({
        success: false,
        message: "Video title must be important !"
      });
    }

    // Check All data from body
    if (!category || !status) {
      return res.status(206).json({
        success: false,
        message: "Video Category & Status reuired !"
      });
    }

    // Check All data from body
    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File not uplode try again!"
      });
    }

    const newVideo = new VideoModel({ //create newVideo
      title,  
      description,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      isPublic: isPublic === 'false' ? false : true,
      status: status || 'public',
      fileUrl,
      uploadedBy: userId,
      ExmeeUserId: ExmeeUserId,
    });

    await newVideo.save(); // save newVideo in db
    let Video = {
      title,
      description,
      category,
    }

    return res.status(201).json({ // send result as true
      success: true,
      message: 'Video uploaded successfully',
      data : Video
    })

  } catch (error) { // if accuerd error
    console.error('Upload Video Error:', error);
    return res.status(201).json({
      success: false,
      message: 'Server error while uploading Video!',
    })
  }
};



// ------[ NOTES: Get all public notes ] -------
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
      sortOption = { createdAt: -1 }; // Newest first
    } else if (sortBy === "oldest") {
      sortOption = { createdAt: 1 }; // Oldest first
    }

    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found !',
      })
    }

    if (user.Role === "Student") {
      const notes = await Note.find({ // all notes find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption).select("-uploadedBy -deletedOn ");

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Public Notes ",
        count: notes.length,
        data: notes,
      });
    }

    if (user.Role === "Instructor") {
      const notes = await Note.find({ // all notes find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption).select("-uploadedBy -deletedOn ");

      // my notes (any status)
      const myNotes = await Note.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn ");

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All My & Public Notes ",
        count: notes.length,
        data: notes,
        myNotes: myNotes,
        myNotesCount: myNotes.length

      });
    }

    if (user.Role === "Admin") {
      const notes = await Note.find({ // all notes find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption);


      // my notes (any status)
      const myNotes = await Note.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn ");

      const allNotes = await Note.find({ category: category }).sort(sortOption); // all notes find from db

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Notes ",
        count: notes.length,
        data: notes,
        myNotes: myNotes,
        myNotesCount: myNotes.length,
        allNotes: allNotes,
        allNotesCount: allNotes.length
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

// ------[ PYQ: Get all public PYQ ] ---------
const getAllPublicPYQ = async (req, res) => {

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
      sortOption = { createdAt: -1 }; // Newest first
    } else if (sortBy === "oldest") {
      sortOption = { createdAt: 1 }; // Oldest first
    }

    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found !',
      })
    }

    if (user.Role === "Student") {
      const pyq = await PYQModel.find({ // all PYQ find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption).select("-uploadedBy -deletedOn ");

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Public PYQ ",
        count: pyq.length,
        data: pyq,
      });
    }

    if (user.Role === "Instructor") {
      const pyq = await PYQModel.find({ // all PYQ find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption).select("-uploadedBy -deletedOn ");

      // my PYQ (any status)
      const myPYQ = await PYQModel.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn ");

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All My & Public PYQ ",
        count: pyq.length,
        data: pyq,
        myPYQ: myPYQ,
        myPYQCount: myPYQ.length

      });
    }

    if (user.Role === "Admin") {
      const pyq = await PYQModel.find({ // all PYQ find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption);

      // my PYQ (any status)
      const myPYQ = await PYQModel.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn ");

      const allPYQ = await PYQModel.find({ category: category }).sort(sortOption); // all PYQ find from db

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All PYQ ",
        count: pyq.length,
        data: pyq,
        myPYQ: myPYQ,
        myPYQCount: myPYQ.length,
        allPYQ: allPYQ,
        allPYQCount: allPYQ.length
      });
    }
  } catch (error) { // if accured some error
    console.error('Error fetching public pyq:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching public pyq',
    });
  }
};

// ------[ VIDEO: Get all public VIDEO ] -----------------
const getAllPublicVIDEO = async (req, res) => {
  try {
    let userId = req.user._id;
    const category = (req.query.category !== undefined && req.query.category !== null && req.query.category.trim() !==" ")
      ? req.query.category
      : "sciTechnology";

    const sortBy = (req.query.sortBy !== undefined && req.query.sortBy !== null)
      ? req.query.sortBy
      : "latest";

    let sortOption = {};
    if (sortBy === "latest") {
      sortOption = { createdAt: -1 }; // Newest first
    } else if (sortBy === "oldest") {
      sortOption = { createdAt: 1 }; // Oldest first
    }

    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found !',
      })
    }

    if (user.Role === "Student") {
      const Video = await VideoModel.find({ // all Video find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption).select("-uploadedBy -deletedOn ");

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Public PYQ ",
        count: Video.length,
        data: Video,
      });
    }

    if (user.Role === "Instructor") {
      const Video = await VideoModel.find({ // all Video find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption).select("-uploadedBy -deletedOn ");

      const myVideo = await VideoModel.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn ");  // my Video (any status)

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All My & Public Video ",
        count: Video.length,
        data: Video,
        myVideo: myVideo,
        myVideoCount: myVideo.length

      });
    }

    if (user.Role === "Admin") {
      const Video = await VideoModel.find({ // all Video find from db
        isPublic: true,
        status: 'public',
        category: category
      }).sort(sortOption);

      const myVideo = await VideoModel.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn "); // my Video (any status)
      const allVideo = await VideoModel.find({ category: category }).sort(sortOption); // all Video find from db

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Video ",
        count: Video.length,
        data: Video,
        myVideo: myVideo,
        myVideoCount: myVideo.length,
        allVideo: allVideo,
        allVideoCount: allVideo.length
      });
    }
  } catch (error) { // if accured some error
    console.error('Error fetching public Video:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching public Video',
    });
  }
};


// ------[ ALLLatest: Get all public ALLLatest ] -----------------
const getLatestUpload = async (req, res) => {
  try {
    let userId = req.user._id;
    const category = (req.query.category !== undefined && req.query.category !== null && req.query.category !=="")
      ? req.query.category
      : "sciTechnology";

    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found !',
      })
    }

    if (user.Role === "Instructor" || user.Role === "Admin") {

      const baseFilter = { ExmeeUserId: user.ExmeeUserId, category: category }
      const sortOption = { createdAt: 1 };
      const [notes, videos, pyqs] = await Promise.all([
        Note.find(baseFilter).sort(sortOption),
        VideoModel.find(baseFilter).sort(sortOption),
        PYQModel.find(baseFilter).sort(sortOption)
      ]);

      // Add 'type' to each entry
      const taggedNotes = notes.map(item => ({ ...item._doc, type: 'Note' }));
      const taggedVideos = videos.map(item => ({ ...item._doc, type: 'Video' }));
      const taggedPYQs = pyqs.map(item => ({ ...item._doc, type: 'PYQ' }));

      // Combine and sort all by createdAt
      const combined = [...taggedNotes, ...taggedVideos, ...taggedPYQs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Limit to top 5 latest uploads
      const latest = combined.slice(0, 4);

      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Latest Uploaded Data ",
        count: latest.length,
        data: latest,
      });
    }
  } catch (error) { // if accured some error
    console.error('Error fetching All Latest Uploaded Data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching All Latest Uploaded Data',
    });
  }
};












module.exports = { uploadNotes, uploadPYQ, uploadVideo, getAllPublicNotes, getAllPublicPYQ, getAllPublicVIDEO, getLatestUpload }