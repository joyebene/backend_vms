import Visitor from '../models/Visitor.js';
import Contractor from '../models/Contractor.js';
import AdminConfig from '../models/AdminConfig.js';
import Employee from '../models/Employee.js';
import sendEmail from '../utils/sendEmail.js';
import generateCard from '../utils/generateCard.js';
import QRCode from 'qrcode';
import ExcelJS from 'exceljs';
import Schedule from '../models/Schedule.js';

export const getAllForms = async (req, res) => {
  try {

    let visitors = [];
    let contractors = [];

    visitors = await Visitor.find().sort({ createdAt: -1 });
    contractors = await Contractor.find().sort({ createdAt: -1 });

    // Tag each entry with its form type
    const taggedVisitors = visitors.map(v => ({ ...v._doc, formType: 'visitor' }));
    const taggedContractors = contractors.map(c => ({ ...c._doc, formType: 'contractor' }));

    // Combine and sort by creation date
    const allForms = [...taggedVisitors, ...taggedContractors].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(allForms);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};

export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try finding the form in Visitors first
    let form = await Visitor.findById(id);
    if (form) {
      return res.status(200).json({ ...form._doc, formType: 'visitor' });
    }

    // If not found in Visitors, try Contractors
    form = await Contractor.findById(id);
    if (form) {
      return res.status(200).json({ ...form._doc, formType: 'contractor' });
    }

    // If not found in either, return 404
    res.status(404).json({ message: 'Form not found' });
  } catch (err) {
    console.error('Error fetching form by ID:', err);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};


export const getAllVisit = async (req, res) => {
  try {

    let visit = [];

    visit = await Schedule.find().sort({ createdAt: -1 });

    // Tag each entry with its form type
    const taggedVisit = visit.map(v => ({ ...v._doc, }));

    // Combine and sort by creation date
    const allForms = [...taggedVisit].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(allForms);
  } catch (err) {
    console.error('Error fetching visits:', err);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
};

export const updateStatus = async (req, res) => {
  const { type, id } = req.params;
  const { status } = req.body;

  if (!['approved', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided' });
  }

  const Model = type === 'visitor' ? Visitor : Contractor;

  try {
    const doc = await Model.findByIdAndUpdate(id, { status }, { new: true });

    if (!doc) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // If approved
    if (status === 'approved') {
      const qrData = `Name: ${doc.firstName} ${doc.lastName}\nEmail: ${doc.email}\nPurpose: ${doc.purpose || 'N/A'}\nID: ${doc._id}`;
      const qrCodeBase64 = await QRCode.toDataURL(qrData); // base64 with data:image/png prefix

      const cardBuffer = await generateCard(doc); // PDF Buffer

      await sendEmail({
        to: doc.email,
        subject: 'Your Visit is Approved',
        html: `
      <p>Dear ${doc.firstName} ${doc.lastName},</p>
      <p>Your visit has been approved. Please find your visitor card attached.</p>
      <p>Below is your QR Code (you can present this at the entrance):</p>
      <img src="${qrCodeBase64}" alt="QR Code" width="150" height="150" />
    `,
        attachments: [
          {
            filename: 'visitor-card.pdf',
            content: cardBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    }


    // If cancelled
    if (status === 'cancelled') {
      await sendEmail({
        to: doc.email,
        subject: 'Your Visit Request Was Rejected',
        html: `
          <p>Dear ${doc.firstName} ${doc.lastName},</p>
          <p>We regret to inform you that your visit has been rejected.</p>
        `,
      });
    }

    res.json({ message: `${status.charAt(0).toUpperCase() + status.slice(1)} and email sent`, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const updateAdminConfig = async (req, res) => {
  try {
    const config = await AdminConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const [visitors, contractors, config, employees] = await Promise.all([
      Visitor.find(),
      Contractor.find(),
      AdminConfig.findOne(),
      Employee.find(),
    ]);
    res.json({ visitors, contractors, config, employees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editForm = async (req, res) => {
  const { type, id } = req.params;
  const updates = req.body;

  const Model = type === 'visitor' ? Visitor : Contractor;

  try {
    const updated = await Model.findByIdAndUpdate(id, updates, { new: true });
    res.json({ message: 'Form updated', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const exportVisitorsToExcel = async (req, res) => {
  try {
    const user = req.user;

    let visitors;
    if (user.role === 'admin' || user.role === 'manager' || user.role === 'security') {
      visitors = await Visitor.find().sort({ createdAt: -1 });
    } else {
      visitors = await Visitor.find({ hostEmployeeId: user._id }).sort({ createdAt: -1 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Visitors');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Company', key: 'company', width: 20 },
      { header: 'Purpose', key: 'purpose', width: 30 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Check-In Time', key: 'checkInTime', width: 20 },
      { header: 'Check-Out Time', key: 'checkOutTime', width: 20 },
    ];

    visitors.forEach(visitor => {
      worksheet.addRow({
        fullName: visitor.fullName,
        email: visitor.email,
        company: visitor.company || '',
        purpose: visitor.purpose || '',
        department: visitor.department || '',
        status: visitor.status,
        checkInTime: visitor.checkInTime?.toISOString() || '',
        checkOutTime: visitor.checkOutTime?.toISOString() || '',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=visitors.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting visitors to Excel:', err);
    res.status(500).json({ error: 'Failed to export visitors' });
  }
};

export const checkOutVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id);
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });

    visitor.status = 'checked-out';
    visitor.checkOutTime = new Date();
    await visitor.save();

    res.json({ message: 'Visitor checked out successfully', visitor });
  } catch (err) {
    console.error('Error checking out visitor:', err);
    res.status(500).json({ error: 'Failed to check out visitor' });
  }
}

export const scheduleVisit = async (req, res) => {

  try {

    const visitor = await Schedule.create(req.body);

    await newVisit.save();

    if (visitor.email) {
      await sendEmail({
        to: visitor.email,
        subject: 'Visit Scheduled',
        html: `
          <p>Dear ${visitor.firstName} ${visitor.lastName},</p>
          <p>You have been scheduled for a meet.</p>
          <p>Visit Details:</p>
          <ul>
            <li><strong>Site:</strong> ${visitor.siteLocation}</li>
            <li><strong>Department:</strong> ${visitor.department}</li>
            <li><strong>Host:</strong> ${visitor.hostEmployee}</li>
            <li><strong>Location:</strong> ${visitor.meetingLocation}</li>
            <li><strong>Start:</strong> ${new Date(visitor.visitStartDate).toLocaleString()}</li>
            <li><strong>End:</strong> ${new Date(visitor.visitEndDate).toLocaleString()}</li>
            <li><strong>Purpose:</strong> ${visitor.purpose}</li>
          </ul>
          <p>Do well to maek your self available.</p>
        `
      })
    }

    res.status(201).json({ message: 'Visitor form submitted', visitor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


};


export const getAllVisitHistory = async (req, res) => {
  try {
    // Fetch all visitors and contractors
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    const contractors = await Contractor.find().sort({ createdAt: -1 });

    // Tag each record
    const taggedVisitors = visitors.map(v => ({
      ...v._doc,
      formType: 'visitor',
    }));

    const taggedContractors = contractors.map(c => ({
      ...c._doc,
      formType: 'contractor',
    }));

    // Combine and sort by creation date (descending)
    const visitHistory = [...taggedVisitors, ...taggedContractors].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(visitHistory);
  } catch (err) {
    console.error('Error fetching visit history:', err);
    res.status(500).json({ error: 'Failed to fetch visit history' });
  }
};
