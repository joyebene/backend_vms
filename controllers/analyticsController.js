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

    return res.status(200).json({
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
    return res.status(500).json({ error: 'Failed to fetch visitor/contractor stats' });
  }
};

export const getAccessMetrics = async (req, res) => {
  try {
    const totalAccessLogs = await AccessLog.countDocuments();
    const successfulAccesses = await AccessLog.countDocuments({ status: 'granted' });
    const deniedAccesses = await AccessLog.countDocuments({ status: 'denied' });

    // Group by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // includes today

    const accessByDay = await AccessLog.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Group by location
    const accessByLocation = await AccessLog.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          location: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    return res.json({
      totalAccesses: totalAccessLogs,
      successfulAccesses,
      deniedAccesses,
      accessesByDay: accessByDay,
      accessesByLocation: accessByLocation
    });
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


export const getVisitorMetrics = async (req, res) => {
  try {
    const visitors = await Visitor.find();
    const contractors = await Contractor.find();

    // Combine both arrays
    const all = [...visitors, ...contractors];

    // Group by day
    const visitorsByDay = all.reduce((acc, person) => {
      const date = new Date(person.createdAt).toISOString().split('T')[0];
      const existing = acc.find(v => v.date === date);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, []);

    // Group by purpose
    const visitorsByPurpose = all.reduce((acc, person) => {
      const purpose = person.purpose || 'Unknown';
      const existing = acc.find(p => p.label === purpose);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ label: purpose, value: 1 });
      }
      return acc;
    }, []);

    return res.json({
      visitorsByDay,
      visitorsByPurpose,
    });
  } catch (err) {
    console.error('Combined visitor metrics error:', err);
    res.status(500).json({ error: 'Failed to compute combined visitor metrics' });
  }
};

