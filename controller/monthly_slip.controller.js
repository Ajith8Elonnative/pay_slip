const slip = require('../model/monthly_slip.model.js')
const path = require('path')
const fs = require('fs')
const generatePDF = require('./generatePdf.js')

exports.create = async(req, res) =>{
   try {
    const filePath = path.join(__dirname, '../views/slip.ejs');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const buffer = await generatePDF(htmlContent)
    const base64Data = buffer.toString('base64');
    // const base64Encoded = Buffer.from(htmlContent).toString('base64');

    const {employeeId, month, year} = req.body
    const check = await slip.findOne({
        $and: [
            { employeeId },   // Match name
            { month } ,
            { year }       // Match age
        ]
    })
    if(check){
       return  res.json({message:"already resister this month"})
    }
        const paySlip = await new slip({
            employeeId,
            month,
            year,
            file:base64Data
        })
        const result = await paySlip.save()
        res.json(result)

   } catch (error) {
    console.error('Error storing payslip:', error);
   }
}


exports.getSlip = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body
        const paySlipRetrieve = await slip.findOne({ employeeId, month, year });

        if (!paySlipRetrieve) {
            res.status(200).json({
                message: "data not found"
            })
        }

        res.json(paySlipRetrieve.file)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}