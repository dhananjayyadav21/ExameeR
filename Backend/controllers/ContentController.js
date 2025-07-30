const Note = require('../model/notesModel');
const userModel = require("../model/User");
const PYQModel = require("../model/pyqModel");
const VideoModel = require("../model/videoModel");
const MyLearningContent = require('../model/myLearning');
const CourseModel = require("../model/courseModel");
const CourseEnroll = require("../model/courseEnroll");
const mongoose = require('mongoose');

//===========================================[ ADD ]=========================================
//--[ NOTES: uplodeNotes Controller ]
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
        message: "Access denied. Only Admin or Instructor can upload notes !",
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
      data: note
    })

  } catch (error) { // if accuerd error
    console.error('Upload Note Error:', error);
    return res.status(201).json({
      success: false,
      message: 'Server error while uploading note!',
    })
  }
};

//--[ PYQ: uplodePYQ Controller ] 
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

//--[ VIDEO: uploadVideo Controller ] 
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
      data: Video
    })

  } catch (error) { // if accuerd error
    console.error('Upload Video Error:', error);
    return res.status(201).json({
      success: false,
      message: 'Server error while uploading Video!',
    })
  }
};

//--[ Cource : uploade Cource ]
const uploadCourse = async (req, res) => {
  try {
    let userId = req.user._id;

    // Check if user exists
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    // Check user role
    if (user.Role !== "Admin" && user.Role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Only Admin or Instructor can upload courses!",
      });
    }

    const {
      title,
      description,
      mentor,
      courseLevel,
      duration,
      price,
      offerPercent,
      offerPrice,
      startDate,
      courseContents,
      whyChoose,
      benefits,
      category,
      isPublic,
      status,
      courseImage,
      trialVideo,
      lectures
    } = req.body;

    // Validate important fields
    if (!title || !mentor || !price || !courseImage || !trialVideo) {
      return res.status(400).json({
        success: false,
        message: "Title, Mentor, Price, Thumbnail (courseImage) & Trial Video are required!",
      });
    }

    // Validate trialVideo URL (basic check)
    if (!trialVideo) {
      return res.status(400).json({
        success: false,
        message: "Please provide YouTube video URL!",
      });
    }

    // Prepare new Course object
    const newCourse = new CourseModel({
      title,
      description,
      mentor,
      courseLevel,
      duration,
      price,
      offerPercent,
      offerPrice,
      startDate,
      courseContents,
      whyChoose,
      benefits,
      category,
      isPublic,
      status,
      courseImage,
      trialVideo,
      lectures: Array.isArray(lectures) ? lectures : [],
      uploadedBy: userId,
    });

    // Save to DB
    await newCourse.save();

    return res.status(201).json({
      success: true,
      message: 'Course uploaded successfully!',
      data: {
        title,
        mentor,
        price,
      },
    });

  } catch (error) {
    console.error('Upload Course Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading course!',
    });
  }
};





//===========================================[ GET ]=========================================
//--[ NOTES: Get all public notes ] 
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

    //-- set criteria for notes
    let criteria = {
      isPublic: true,
      status: 'public',
      category: category
    };

    //-- find notes
    const notes = await Note.aggregate([
      {
        $match: criteria
      },
      // Convert ObjectId to string
      {
        $addFields: {
          noteIdString: { $toString: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'mylearningcontents',
          let: { noteIdStr: '$noteIdString' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$contentId', '$$noteIdStr'] },
                    { $eq: ['$contentType', 'Note'] },
                    { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'learningMatch'
        }
      },
      {
        $addFields: {
          isWatching: { $gt: [{ $size: '$learningMatch' }, 0] }
        }
      },
      {
        $project: {
          uploadedBy: 0,
          deletedOn: 0,
          learningMatch: 0,
          noteIdString: 0
        }
      },
      {
        $sort: sortOption
      }
    ]);

    if (user.Role === "Student") {
      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Public Notes ",
        count: notes.length,
        data: notes,
      });
    }

    if (user.Role === "Instructor") {
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

//--[ PYQ: Get all public PYQ ] 
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


    //-- set criteria for pyq
    let criteria = {
      isPublic: true,
      status: 'public',
      category: category
    };

    //--find Pyq
    const pyq = await PYQModel.aggregate([
      {
        $match: criteria
      },
      {
        $addFields: {
          pyqIdString: { $toString: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'mylearningcontents',
          let: { pyqIdStr: '$pyqIdString' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$contentId', '$$pyqIdStr'] },
                    { $eq: ['$contentType', 'PYQ'] },
                    { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'learningMatch'
        }
      },
      {
        $addFields: {
          isWatching: { $gt: [{ $size: '$learningMatch' }, 0] }
        }
      },
      {
        $project: {
          uploadedBy: 0,
          deletedOn: 0,
          learningMatch: 0,
          pyqIdString: 0
        }
      },
      {
        $sort: sortOption
      }
    ]);


    if (user.Role === "Student") {
      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Public PYQ ",
        count: pyq.length,
        data: pyq,
      });
    }

    if (user.Role === "Instructor") {
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

//--[ VIDEO: Get all public VIDEO ] 
const getAllPublicVIDEO = async (req, res) => {
  try {
    let userId = req.user._id;
    const category = (req.query.category !== undefined && req.query.category !== null && req.query.category.trim() !== " ")
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

    //-- set criteria for video
    let criteria = {
      isPublic: true,
      status: 'public',
      category: category
    };

    //--find Video
    const Video = await VideoModel.aggregate([
      { $match: criteria },
      {
        $addFields: {
          videoIdString: { $toString: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'mylearningcontents',
          let: { videoIdStr: '$videoIdString' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$contentId', '$$videoIdStr'] },
                    { $eq: ['$contentType', 'Video'] },
                    { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'learningMatch'
        }
      },
      {
        $addFields: {
          isWatching: { $gt: [{ $size: '$learningMatch' }, 0] }
        }
      },
      {
        $project: {
          uploadedBy: 0,
          deletedOn: 0,
          learningMatch: 0,
          videoIdString: 0
        }
      },
      { $sort: sortOption }
    ]);


    if (user.Role === "Student") {
      res.status(200).json({ // return result as true
        success: true,
        message: "Fetch All Public PYQ ",
        count: Video.length,
        data: Video,
      });
    }

    if (user.Role === "Instructor") {
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

//--[ COURSE: Get all public Course ] 
const getAllPublicCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const category = (req.query.category && req.query.category.trim() !== "")
      ? req.query.category
      : "sciTechnology";

    const sortBy = req.query.sortBy || "latest";

    let sortOption = {};
    if (sortBy === "latest") sortOption = { createdAt: -1 };
    else if (sortBy === "oldest") sortOption = { createdAt: 1 };

    // Check user
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    // Get all public courses
    const courses = await CourseModel.find({
      isPublic: true,
      status: 'public',
      category: category
    }).sort(sortOption).select("-uploadedBy");

    // Get enrolled courseIds for user
    const enrollments = await CourseEnroll.find({ userId });
    const enrolledCourseIds = enrollments.map(e => e.courseId.toString());

    // Mark enrollment status
    const coursesWithStatus = courses.map(course => {
      return {
        ...course.toObject(),
        isEnrolled: enrolledCourseIds.includes(course._id.toString())
      };
    });

    // Return based on user role
    if (user.Role === "Student") {
      return res.status(200).json({
        success: true,
        message: "Fetch All Public Course",
        count: coursesWithStatus.length,
        data: coursesWithStatus,
      });
    }

    if (user.Role === "Instructor") {
      const myCourse = await CourseModel.find({
        uploadedBy: userId,
        category: category
      }).select("-uploadedBy");

      return res.status(200).json({
        success: true,
        message: "Fetch All My & Public Courses",
        count: coursesWithStatus.length,
        data: coursesWithStatus,
        myCourse,
        myCourseCount: myCourse.length
      });
    }

    if (user.Role === "Admin") {
      const myCourse = await CourseModel.find({
        uploadedBy: userId,
        category: category
      }).select("-uploadedBy");

      const allCourse = await CourseModel.find({
        category: category
      }).sort(sortOption);

      return res.status(200).json({
        success: true,
        message: "Fetch All Courses",
        count: coursesWithStatus.length,
        data: coursesWithStatus,
        myCourse,
        myCourseCount: myCourse.length,
        allCourse,
        allCourseCount: allCourse.length
      });
    }

  } catch (error) {
    console.error('Error fetching public Course:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching public Course',
    });
  }
};


//---[ ALLLatest: Get all public ALLLatest ] 
const getLatestUpload = async (req, res) => {
  try {
    let userId = req.user._id;
    const category = (req.query.category !== undefined && req.query.category !== null && req.query.category !== "")
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




//===========================================[ UPDATE ]=========================================
//--- Update Note
const updateNotes = async (req, res) => {
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
        message: "Access denied. Only Admin or Instructor can updates notes !",
      })
    }

    const noteId = req.params.id;
    const updatedData = req.body;  // all fields coming from frontend

    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, { new: true });

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: 'Notes not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notes updated successfully',
      note: updatedNote
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notes',
      error: error.message
    });
  }
};

//--- Update PYQ
const updatePyq = async (req, res) => {
  try {
    let userId = req.user._id;

    // Check user exists
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    // Check role
    if (user.Role !== "Admin" && user.Role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Only Admin or Instructor can update PYQs!",
      });
    }

    const pyqId = req.params.id;
    const updatedData = req.body;  // fields from frontend

    const updatedPyq = await PYQModel.findByIdAndUpdate(pyqId, updatedData, { new: true });

    if (!updatedPyq) {
      return res.status(404).json({
        success: false,
        message: 'PYQ not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'PYQ updated successfully',
      pyq: updatedPyq
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update PYQ',
      error: error.message
    });
  }
};

//--- update video
const updateVideo = async (req, res) => {
  try {
    let userId = req.user._id;

    // Check user exists
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    // Check role
    if (user.Role !== "Admin" && user.Role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Only Admin or Instructor can update Videos!",
      });
    }

    const videoId = req.params.id;
    const updatedData = req.body;  // fields from frontend

    const updatedVideo = await VideoModel.findByIdAndUpdate(videoId, updatedData, { new: true });

    if (!updatedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      video: updatedVideo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update video',
      error: error.message
    });
  }
};

//-- update course
const updateCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    // Check if user exists
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Check if the user has permission
    if (user.Role !== 'Admin' && user.Role !== 'Instructor') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Only Admin or Instructor can update courses!',
      });
    }

    const {
      title,
      description,
      mentor,
      courseLevel,
      duration,
      price,
      offerPercent,
      offerPrice,
      startDate,
      courseContents,
      whyChoose,
      benefits,
      category,
      isPublic,
      status,
      courseImage,
      trialVideo,
      lectures,
    } = req.body;

    // Validate important fields
    if (!title || !mentor || !price || !trialVideo) {
      return res.status(400).json({
        success: false,
        message: 'Title, Mentor, Price & Trial Video are required!',
      });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found!' });
    }

    // Update fields
    course.title = title;
    course.description = description;
    course.mentor = mentor;
    course.courseLevel = courseLevel;
    course.duration = duration;
    course.price = price;
    course.offerPercent = offerPercent;
    course.offerPrice = offerPrice;
    course.startDate = startDate;
    course.courseContents = courseContents;
    course.whyChoose = whyChoose;
    course.benefits = benefits;
    course.category = category;
    course.isPublic = isPublic;
    course.status = status;
    course.courseImage = courseImage;
    course.trialVideo = trialVideo;
    course.lectures = Array.isArray(lectures) ? lectures : [];

    await course.save();

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully!',
      data: { title, mentor, price },
    });
  } catch (error) {
    console.error('Update Course Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating course!',
    });
  }
};




//===========================================[ DELETE ]=========================================
//---- Delete Note
const deleteNote = async (req, res) => {
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
        message: "Access denied. Only Admin or Instructor can delete notes !",
      })
    }

    const noteId = req.params.id;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: 'Notes not found'
      });
    }

    // Delete associated MyLearning content entries
    await MyLearningContent.deleteMany({ contentId: noteId });

    res.status(200).json({
      success: true,
      message: 'Notes deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notes',
      error: error.message
    });
  }
};

//--- Delete PYQ
const deletePYQ = async (req, res) => {
  try {
    let userId = req.user._id;
    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    // check user role
    if (user.Role !== "Admin" && user.Role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Only Admin or Instructor can delete PYQs!",
      });
    }

    const pyqId = req.params.id;

    const deletedPYQ = await PYQModel.findByIdAndDelete(pyqId);

    if (!deletedPYQ) {
      return res.status(404).json({
        success: false,
        message: 'PYQ not found',
      });
    }

    // Delete associated MyLearning content entries
    await MyLearningContent.deleteMany({ contentId: pyqId });

    res.status(200).json({
      success: true,
      message: 'PYQ deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete PYQ',
      error: error.message,
    });
  }
};

//---- Delete Video
const deleteVideo = async (req, res) => {
  try {
    let userId = req.user._id;
    // check user exist or not
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    // check user role
    if (user.Role !== "Admin" && user.Role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Only Admin or Instructor can delete videos!",
      });
    }

    const videoId = req.params.id;

    const deletedVideo = await VideoModel.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Delete associated MyLearning content entries
    await MyLearningContent.deleteMany({ contentId: videoId });

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete video',
      error: error.message,
    });
  }
};

//-- delete course
const deleteCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    // Check if user exists
    const user = await userModel.findById(userId).select('-Password -ForgotPasswordCode');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Check permission
    if (user.Role !== 'Admin' && user.Role !== 'Instructor') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Only Admin or Instructor can delete courses!',
      });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found!' });
    }

    await CourseModel.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Course Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting course!',
    });
  }
};




module.exports = {
  uploadNotes, uploadPYQ, uploadVideo, uploadCourse,
  getAllPublicNotes, getAllPublicPYQ, getAllPublicVIDEO, getAllPublicCourse, getLatestUpload,
  updateNotes, updatePyq, updateVideo, updateCourse,
  deleteNote, deletePYQ, deleteVideo, deleteCourse,
}