import Visitor from '../models/Visitor.js';
import Contractor from '../models/Contractor.js';
import sendEmail from '../utils/sendEmail.js';
import Training from '../models/Training.js';


export const submitVisitorForm = async (req, res) => {
    try {
        const visitor = await Visitor.create(req.body);

        await sendEmail({
            to: visitor.email,
            subject: 'Visitor Form Submitted',
            html: `<p>Your visitor form has been submitted successfully. </p>`,
        });

        await sendEmail({
            to: process.env.MAIN_EMAIL,
            subject: 'New Visitor Submitted',
            html: `
                <p><strong>Type:</strong> Visitor</p>
                <p><strong>Name:</strong>${visitor.firstName} ${visitor.lastName}</p>
                <p><strong>Email:</strong> ${visitor.email}</p>
                <p><strong>Created by:</strong>${visitor.firstName} ${visitor.lastName}</p>
                <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>  `
        });


        res.status(201).json({ message: 'Visitor form submitted', visitor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const submitContractorForm = async (req, res) => {
    try {
    const {
      firstName,
      lastName,
      phone,
      email,
      visitorCategory,
      siteLocation,
      department,
      hostEmployee,
      meetingLocation,
      visitStartDate,
      visitEndDate,
      purpose,
      agreed,
      hazards,
      ppe,
    } = req.body;

    // Parse stringified fields
    const parsedHazards = typeof hazards === 'string' ? JSON.parse(hazards) : hazards;
    const parsedPPE = typeof ppe === 'string' ? JSON.parse(ppe) : ppe;

    const contractorData = {
      firstName,
      lastName,
      phone,
      email,
      visitorCategory,
      siteLocation,
      department,
      hostEmployee,
      meetingLocation,
      visitStartDate,
      visitEndDate,
      purpose,
      agreed,
      hazards: parsedHazards,
      ppe: parsedPPE,
    };

        const contractor = await Contractor.create(contractorData);

        await sendEmail({
            to: contractor.email,
            subject: 'Contractor form has been submitted successfully.</p>',
        });

        await sendEmail({
            to: process.env.MAIN_EMAIL,
            subject: 'New Contractor Submitted',
            html: `
                <p><strong>Type:</strong> Contractor</p>
                <p><strong>Name:</strong> ${contractor.firstName} ${contractor.lastName}</p>
                <p><strong>Email:</strong> ${contractor.email}</p>
                <p><strong>Created by:</strong> ${contractor.firstName}  ${contractor.lastName}</p>
                <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>

  `
        });


        res.status(201).json({ message: 'Contractor form submitted', contractor })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFormByEmail = async (req, res) => {
  const { email } = req.body
  try {
    const visitor = await Visitor.findOne({ email });
    if (visitor) {
      return res.json({ type: 'visitor', data: visitor });
    }

    const contractor = await Contractor.findOne({ email });
    if (contractor) {
      return res.json({ type: 'contractor', data: contractor });
    }

    return res.status(404).json({ message: 'No form found for this email' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all trainings
export const getAllTrainings = async (req, res) => {
  const trainings = await Training.find();
  res.json(trainings);
};


