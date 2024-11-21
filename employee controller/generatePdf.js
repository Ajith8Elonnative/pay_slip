const pdf = require('html-pdf');
const generatePdf = (html) => {
    return new Promise((resolve, reject) => {
        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
                top: '0.01in',
                right: '0.0in',
                bottom: '0.0in',
                left: '0.0in'
            },
            type: 'pdf',
            quality: '100',
            timeout: 60000
        };

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