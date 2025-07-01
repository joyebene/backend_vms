import Training from '../models/Training.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';
import Contractor from '../models/Contractor.js';

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
  const { contractorId, score } = req.body;

  try {
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) return res.status(404).json({ message: 'Contractor not found' });

    contractor.trainingCompleted = true;
    contractor.score = score;
    await contractor.save();

    res.json({ message: 'Training submitted successfully', score });
  } catch (err) {
    console.error('Error submitting training:', err);
    res.status(500).json({ message: 'Failed to submit training' });
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

// PATCH /trainings/:id/toggle
export const toggleTrainingStatus = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: 'Training not found' });

    training.isActive = !training.isActive;
    await training.save();

    res.json({ message: 'Training status updated', training });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};
