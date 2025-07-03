import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  photo: {
  url: { type: String },
  name: { type: String },
  uploadedAt: { type: Date, default: Date.now }
},
pics: String,

  visitorCategory: { type: String, enum: ['contractor', 'visitor'], required: true, default: 'contractor' },
  siteLocation: { type: String, required: true },
  department: { type: String, required: true },
  hostEmployee: { type: String, required: true },
  meetingLocation: { type: String, required: true },
  checkOutTime: Date,
  checkInTime: Date,
  visitStartDate: { type: Date, required: false },
  visitEndDate: { type: Date, required: false },

  trainingCompleted: Boolean,
  score: Number,
  
  completedTrainings: [
  {
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Training',
    },
    title: String,
    completedAt: Date,
    score: Number, // Optional: for quizzes
  }
],


  purpose: { type: String, required: true },
  agreed: String,

  hazards: [
    {
      title: { type: String, required: true },
      risk: { type: String, enum: ['H', 'M', 'L'], required: true },
      selectedControls: [{ type: String }]
    }
  ],

  ppe: {
    "HARD HAT": { type: String, enum: ['Y', 'N'] },
    "SAFETY SHOES": { type: String, enum: ['Y', 'N'] },
    "OVERALLS": { type: String, enum: ['Y', 'N'] },
    "EYE PROTECTION": { type: String, enum: ['Y', 'N'] },
    "VEST VEST": { type: String, enum: ['Y', 'N'] },
    "EAR PROTECTION": { type: String, enum: ['Y', 'N'] },
    "RESPIRATORY EQUIP": { type: String, enum: ['Y', 'N'] },
    "GLOVES": { type: String, enum: ['Y', 'N'] },
    "DUST MASK": { type: String, enum: ['Y', 'N'] },
    "FALL ARREST": { type: String, enum: ['Y', 'N'] }
  },
   documents: [
    {
      name: { type: String }, // file name
      url: { type: String }, // where file is stored (e.g., S3, local, Cloudinary)
      type: { type: String }, // optional: MIME type like "application/pdf"
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Contractor || mongoose.model('Contractor', contractorSchema);
