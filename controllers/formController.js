import Visitor from '../models/Visitor.js';
import Contractor from '../models/Contractor.js';
import sendEmail from '../utils/sendEmail.js';
import Training from '../models/Training.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// SUBMIT VISITOR FORM
export const submitVisitorForm = async (req, res) => {
  try {
     let {
      firstName, lastName, phone, email,
      visitorCategory, siteLocation, department, hostEmployee,
      meetingLocation, visitStartDate, visitEndDate, purpose,
      agreed, pics
    } = req.body;

    // Basic validation
    if (!email || !firstName || !visitStartDate) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

      // Upload profile picture
    let uploadedPic = null;
    if (pics) {
      try {
        uploadedPic = await uploadToCloudinary(pics, 'visitor/profile_pics');
      } catch (error) {
        console.error('Profile pic upload failed:', error);
      }
    }

    // Create contractor record
    const visitor = await Visitor.create({
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
      pics: uploadedPic?.url || null,
    });

    await sendEmail({
      to: visitor.email,
      subject: 'Visitor Form Submitted',
      html: `<p>Your visitor form has been submitted successfully.</p>`,
    });

    await sendEmail({
      to: process.env.MAIN_EMAIL,
      subject: 'New Visitor Submitted',
      html: `
        <p><strong>Type:</strong> Visitor</p>
        <p><strong>Name:</strong> ${visitor.firstName} ${visitor.lastName}</p>
        <p><strong>Email:</strong> ${visitor.email}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    res.status(201).json({ message: 'Visitor form submitted', visitor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SUBMIT CONTRACTOR FORM
export const submitContractorForm = async (req, res) => {
  try {
    let {
      firstName, lastName, phone, email,
      visitorCategory, siteLocation, department, hostEmployee,
      meetingLocation, visitStartDate, visitEndDate, purpose,
      agreed, hazards, ppe, pics, documents,
    } = req.body;

    console.log(pics)

    // Basic validation
    if (!email || !firstName || !visitStartDate) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Parse JSON fields if needed
    const parsedHazards = typeof hazards === 'string' ? JSON.parse(hazards) : hazards;
    const parsedPPE = typeof ppe === 'string' ? JSON.parse(ppe) : ppe;
    const parsedDocs = typeof documents === 'string' ? JSON.parse(documents) : documents;

    // Upload profile picture
    let uploadedPic = null;
    if (pics) {
      try {
        uploadedPic = await uploadToCloudinary(pics, 'contractors/profile_pics');
      } catch (error) {
        console.error('Profile pic upload failed:', error);
      }
    }

    // Upload documents
    const uploadedDocs = [];
    if (Array.isArray(parsedDocs)) {
      for (const doc of parsedDocs) {
        try {
          const result = await uploadToCloudinary(doc.file, 'contractors/documents');
          uploadedDocs.push({
            name: doc.name || result.name,
            url: result.url,
            type: result.type,
          });
        } catch (error) {
          console.error(`Failed to upload document "${doc.name}":`, error);
        }
      }
    }

    // Create contractor record
    const contractor = await Contractor.create({
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
      pics: uploadedPic?.url || null,
      documents: uploadedDocs,
    });

    // Send confirmation to contractor
    await sendEmail({
      to: contractor.email,
      subject: 'Contractor Form Submitted',
      html: `<p>Your contractor form has been submitted successfully.</p>`,
    });

    // Send notification to admin
    await sendEmail({
      to: process.env.MAIN_EMAIL,
      subject: 'New Contractor Submitted',
      html: `
        <p><strong>Type:</strong> Contractor</p>
        <p><strong>Name:</strong> ${contractor.firstName} ${contractor.lastName}</p>
        <p><strong>Email:</strong> ${contractor.email}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    res.status(201).json({ message: 'Contractor form submitted', contractor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET FORM BY EMAIL (Visitor or Contractor)
export const getFormByEmail = async (req, res) => {
  const email = req.body.email || req.query.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

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

// GET ALL TRAININGS
export const getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
};
