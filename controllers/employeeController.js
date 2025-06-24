import User from '../models/User.js';

// Get all employees (hosts)
export const getEmployees = async (req, res) => {
  try {
    const hosts = await User.find({ role: 'host' }).select('-password');
    const formatted = hosts.map(user => ({
      id: user._id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      department: user.department || 'General',
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error while fetching employees' });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user || user.role !== 'host') {
      return res.status(404).json({ message: 'Employee (host) not found' });
    }

    res.json({
      id: user._id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      department: user.department || 'General',
    });
  } catch (err) {
    console.error('Error fetching employee by ID:', err);
    res.status(500).json({ message: 'Server error while fetching employee' });
  }
};
