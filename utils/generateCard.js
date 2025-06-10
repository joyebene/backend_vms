import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import getStream from 'get-stream'; // Helper to convert PDF to buffer

const generateCard = async (data) => {
  try {
    if (!data.firstName || !data.email) {
      throw new Error('Missing required visitor data.');
    }

    const doc = new PDFDocument();
    const qrData = `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPurpose: ${data.purpose || 'N/A'}\nID: ${data._id}`;
    const qrImage = await QRCode.toDataURL(qrData);

    doc.fontSize(20).text('Visitor Card', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${data.firstName} ${data.lastName}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Department: ${data.department}`);
    doc.text(`Purpose: ${data.purpose}`);
    doc.text(`Meeting: ${data.employeeToMeet}`);
    doc.moveDown();

    // Convert QR Code from base64 to buffer
    const base64Data = qrImage.split(',')[1];
    const qrBuffer = Buffer.from(base64Data, 'base64');
    doc.image(qrBuffer, { fit: [150, 150], align: 'center' });

    doc.end();
    console.log('PDFDocument Stream:', doc);
    return await getStream(doc, { encoding: 'buffer' });
    

  } catch (error) {
    console.error('Error generating visitor card:', error);
    throw error;
  }
};

export default generateCard;


// import PDFDocument from 'pdfkit';
// import QRCode from 'qrcode';
// import getStream from 'get-stream';

// const generateCard = async (data) => {
//   try {
//     if (!data.firstName || !data.email) {
//       throw new Error('Missing required visitor data.');
//     }

//     const doc = new PDFDocument();
//     const qrData = `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPurpose: ${data.purpose || 'N/A'}\nID: ${data._id}`;
//     const qrImage = await QRCode.toDataURL(qrData);

//     doc.fontSize(20).text('Visitor Card', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(14).text(`Name: ${data.firstName} ${data.lastName}`);
//     doc.text(`Email: ${data.email}`);
//     doc.text(`Department: ${data.department}`);
//     doc.text(`Purpose: ${data.purpose}`);
//     doc.text(`Meeting: ${data.employeeToMeet}`);
//     doc.moveDown();

//     // Convert QR Code from base64 to buffer correctly
//     const base64Data = qrImage.split(',')[1];
//     const qrBuffer = Buffer.from(base64Data, 'base64');
//     doc.image(qrBuffer, 100, 200, { width: 150, height: 150 });

//     doc.end();

//     // Properly convert stream to buffer
//     return await getStream(doc);

//   } catch (error) {
//     console.error('Error generating visitor card:', error);
//     throw error;
//   }
// };

// export default generateCard;

