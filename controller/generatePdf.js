const pdf = require('html-pdf');
const generatePdf = (html) => {
    return new Promise((resolve, reject) => {
        const options = { format: 'A4', orientation: 'portrait' };
        
        // Generate the PDF using html-pdf
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
};
module.exports = generatePdf