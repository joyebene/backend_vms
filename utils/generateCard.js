import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { buffer } from 'get-stream';

const generateCard = async (data) => {
  try {
    if (!data.firstName || !data.email) {
      throw new Error('Missing required visitor data.');
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Build QR Code text
    const qrData = `Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Purpose: ${data.purpose || 'N/A'}
ID: ${data._id}`;

    // Generate QR code in base64
    const qrImageBase64 = await QRCode.toDataURL(qrData);
    const qrImageBuffer = Buffer.from(qrImageBase64.split(',')[1], 'base64');

    // Layout PDF
    doc.fontSize(20).text('Visitor Access Card', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${data.firstName} ${data.lastName}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Department: ${data.department || 'N/A'}`);
    doc.text(`Purpose: ${data.purpose || 'N/A'}`);
    doc.text(`Meeting With: ${data.hostEmployee || 'N/A'}`);
    doc.text(`Visit ID: ${data._id}`);
    doc.moveDown();

    // Add QR image
    doc.image(qrImageBuffer, {
      fit: [150, 150],
      align: 'center',
      valign: 'center',
    });

    // Finalize and convert stream to buffer
    doc.end();
    // return await getStream.buffer(doc);
    return await buffer(doc);


  } catch (error) {
    console.error('Error generating visitor card:', error.message);
    throw error;
  }
};

export default generateCard;
