import Training from '../models/Training.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';

// GET /training/:id
export const getTrainingById = async (req, res) => {
  const { id } = req.params;
  try {
    const training = await Training.findById(id);
    if (!training) return res.status(404).json({ message: 'Training not found' });
    res.json(training);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /training/:id
export const updateTraining = async (req, res) => {
  const { id } = req.params;
  try {
    const training = await Training.findByIdAndUpdate(id, req.body, { new: true });
    res.json(training);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /training/:id
export const deleteTraining = async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.json({ message: 'Training deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /training/enrollments
export const enrollVisitor = async (req, res) => {
  const { visitorId, trainingId } = req.body;
  try {
    const exists = await Enrollment.findOne({ visitorId, trainingId });
    if (exists) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = await Enrollment.create({ visitorId, trainingId });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /training/enrollments/visitor/:visitorId
export const getTrainingStatus = async (req, res) => {
  const { visitorId } = req.params;
  try {
    const status = await Enrollment.find({ visitorId }).populate('trainingId');
    res.json(status);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /training/submit
export const submitTraining = async (req, res) => {
  const { visitorId, trainingId, answers } = req.body;
  try {
    const training = await Training.findById(trainingId);
    if (!training) return res.status(404).json({ message: 'Training not found' });

    const enrollment = await Enrollment.findOne({ visitorId, trainingId });
    if (!enrollment) return res.status(400).json({ message: 'Not enrolled' });

    const correct = training.quizzes.map(q => q.answer);
    const score = answers.reduce((sum, ans, i) => sum + (ans === correct[i] ? 1 : 0), 0);

    enrollment.answers = answers;
    enrollment.score = score;
    enrollment.completed = true;
    await enrollment.save();

    res.json({ message: 'Training submitted', score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /training/certificates/:enrollmentId
export const generateCertificate = async (req, res) => {
  const { enrollmentId } = req.params;
  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || !enrollment.completed)
      return res.status(400).json({ message: 'Training not completed yet' });

    const certificate = await Certificate.create({
      enrollmentId,
      certificateUrl: `https://yourdomain.com/certificates/${enrollmentId}.pdf`,
    });

    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
