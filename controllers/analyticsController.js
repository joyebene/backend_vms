import Visitor from '../models/Visitor.js';
import Contractor from '../models/Contractor.js';
import AccessLog from '../models/AccessLog.js';
import TrainingRecord from '../models/TrainingRecord.js';

export const getVisitorStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const checkedInVisitors = await Visitor.countDocuments({ status: 'checked-in' });
    const checkedOutVisitors = await Visitor.countDocuments({ status: 'checked-out' });
    const scheduledVisitors = await Visitor.countDocuments({ status: 'scheduled' });
    const pendingVisitors = await Visitor.countDocuments({ status: 'pending' });
    const approvedVisitors = await Visitor.countDocuments({ status: 'approved' });

    const totalContractors = await Contractor.countDocuments();
    const checkedInContractors = await Contractor.countDocuments({ status: 'checked-in' });
    const checkedOutContractors = await Contractor.countDocuments({ status: 'checked-out' });
    const scheduledContractors = await Contractor.countDocuments({ status: 'scheduled' });
    const pendingContractors = await Contractor.countDocuments({ status: 'pending' });
    const approvedContractors = await Contractor.countDocuments({ status: 'approved' });

    return res.json({
      visitor: {
        total: totalVisitors,
        checkedIn: checkedInVisitors,
        checkedOut: checkedOutVisitors,
        scheduled: scheduledVisitors,
        pending: pendingVisitors,
        approved: approvedVisitors,
      },
      contractor: {
        total: totalContractors,
        checkedIn: checkedInContractors,
        checkedOut: checkedOutContractors,
        scheduled: scheduledContractors,
        pending: pendingContractors,
        approved: approvedContractors,
      }
    });
  } catch (err) {
    console.error('Visitor & Contractor stats error:', err);
    res.status(500).json({ error: 'Failed to fetch visitor/contractor stats' });
  }
};

export const getAccessMetrics = async (req, res) => {
  try {
    const totalAccessLogs = await AccessLog.countDocuments();
    const today = new Date().setHours(0, 0, 0, 0);

    const todayAccessLogs = await AccessLog.countDocuments({
      createdAt: { $gte: new Date(today) }
    });

   return res.json({ total: totalAccessLogs, today: todayAccessLogs });
  } catch (err) {
    console.error('Access metrics error:', err);
    res.status(500).json({ error: 'Failed to fetch access metrics' });
  }
};

export const getTrainingMetrics = async (req, res) => {
  try {
    const totalTrainings = await TrainingRecord.countDocuments();
    const completed = await TrainingRecord.countDocuments({ status: 'completed' });
    const inProgress = await TrainingRecord.countDocuments({ status: 'in-progress' });

    return res.json({ total: totalTrainings, completed, inProgress });
  } catch (err) {
    console.error('Training metrics error:', err);
    res.status(500).json({ error: 'Failed to fetch training metrics' });
  }
};
