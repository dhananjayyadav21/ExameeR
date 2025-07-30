const fetchUser = require("../middleware/fetchUser");
const router = require('express').Router();
const courseEnrollController = require('../controllers/EnrollController');

// POST: Enroll a user
router.post('/enroll', fetchUser, courseEnrollController.enrollInCourse);

// GET: All enrollments
// router.get('/enrollments', courseEnrollController.getAllEnrollments);

// GET: Enrollment by userId and courseId
// router.get('/enrollments/:userId/:courseId', courseEnrollController.getEnrollmentByUserAndCourse);

// PUT: Update enrollment
// router.put('/enrollments/:id', courseEnrollController.updateEnrollment);

// DELETE: Delete enrollment
// router.delete('/enrollments/:id', courseEnrollController.deleteEnrollment);

module.exports = router;
