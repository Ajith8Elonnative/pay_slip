const paySlip = require('../model/pay_slip.model.js')
const empDetails = require('../model/emp.model.js')
const base64toPdf = require('base64topdf')
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer')
require('dotenv').config()
const fs = require('fs');
const generatePDF = require('../controller/generatePdf.js');
const { info } = require('console');
const basefile = require('../model/monthly_slip.model.js')
const getEmail = require('../model/emp.model.js')



exports.getAll = async (req, res) => {
    try {
        const get = await paySlip.find()
        res.status(200).json(get)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getByMonth = async (req, res) => {
    try {
        const { paymentDate } = req.params
        const getMonthData = await paySlip.find({ paymentDate: paymentDate })
        if (!getMonthData) {
            res.status(400).json({ message: "[page not found" })
        }
        res.status(200).json({
            message: "get data successfully...",
            data: getMonthData
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.create = async (req, res) => {
    try {
        const { empId, empName, salary, totalWorkingDays, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, basics, totalReduction, crossEarning, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body
        const Loss = Math.round(lossOfPayDaysAndHour * salary / totalWorkingDays)
        const crossEarn = Number(performanceAndSpecialAllowens) + Number(salary)
        const InPf = Number(pf) + Number(incomeTax)
        const InPfLoss = Number(pf) + Number(incomeTax) + Loss
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / totalWorkingDays) + (performanceAndSpecialAllowens - InPf);
        const calculatedTotalAmount = Math.round(actualSalary);
        const create = await new paySlip({
            empId,
            empName,
            salary,
            totalWorkingDays,
            payPeriod,
            paymentDate,
            paidDays,
            lossOfPayDaysAndHour,
            basics: salary,
            incomeTax,
            loss: Loss,
            pf,
            crossEarning: crossEarn,
            totalReduction: InPfLoss,
            performanceAndSpecialAllowens,
            totalAmount: calculatedTotalAmount,
        })

        const pay = await paySlip.find({ payPeriod: payPeriod, empId: empId })
        if (pay.length === 0) {
            await create.save()
        }
        const imagePath = path.join(__dirname, '../public/elonImage.png');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

        const empDetail = await empDetails.findOne({ empId: req.body.empId });

        const html = await ejs.renderFile(path.join(__dirname, '../views/slip.ejs'), { paySlipData: create, emp: empDetail, imageUrl: base64Image, });
        const buffer = await generatePDF(html)
        const base64Data = buffer.toString('base64');
        const [day, month, year] = await paymentDate.split('/')
        const pdfBase = await new basefile({
            file: base64Data,
            employeeId: empId,
            month: month,
            year: year
        })
        const validId = await basefile.find({ employeeId: empId })
        if (validId.length === 0) {
            await pdfBase.save()
        }
        res.status(201).json({
            message: 'PDF Generated Successefully',
            code: 'PS-201',
            data: base64Data
        });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.sendEmail = async (req, res) => {
    try {
        // const empIds = Array.isArray(req.body.data) ? req.body.data : [req.body.data];
        // const emails = await Promise.all(
        //     empIds.map(async ({ empId }) => {
        //         const searchEmail = await getEmail.find({ empId })
        //         const getFile = await basefile.find({empId})

        //         return searchEmail.length > 0 ? searchEmail[0].email : null
                
        //     })
        // )
        // const findEmails = emails
        
        // const base64 = await basefile.find()
        const {email} = req.params
        const {employeeId} = req.body
        const base64 = await basefile.find({employeeId})
        const getbase64 = base64[0].file
        const base64String = "data:application/pdf;base64"+getbase64;
        base64toPdf.base64Decode(base64String,'pay_slip.pdf')

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email_user,
                pass: process.env.email_password
            },
        });

        const mailOptions = {
            from: process.env.email_user,
            to: req.params.email,
            subject: "hi this is test process",
            text: 'This is a test email sent using Nodemailer.',
            html: '<h1>Hello!</h1><p>This is a test email sent using <b>Nodemailer</b>.</p>',
            attachments: [
        {
            filename: 'pay_slip.pdf',                                         
            contentType: 'application/pdf'
        }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log("error occur", error)
            }
            console.log("mail send succcessfully")
        })
        await fs.unlink('./pay_slip.pdf', (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File successfully deleted!');
            }
        });
        res.status(200).json("mail successfully")
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.update = async (req, res) => {
    try {
        const {
            empId,
            empName,
            salary,
            totalWorkingDays,
            payPeriod,
            paymentDate,
            paidDays,
            lossOfPayDaysAndHour,
            incomeTax,
            pf,
            performanceAndSpecialAllowens,
        } = req.body;

        const Loss = Math.round((lossOfPayDaysAndHour * salary) / totalWorkingDays);
        const crossEarn = Number(performanceAndSpecialAllowens) + Number(salary);
        const InPf = Number(pf) + Number(incomeTax);
        const InPfLoss = InPf + Loss;
        const actualSalary = salary - (Loss || 0) + (performanceAndSpecialAllowens || 0) - InPf;
        const calculatedTotalAmount = Math.round(actualSalary);

        const updatePayload = {
            empId,
            empName,
            salary,
            payPeriod,
            totalWorkingDays,
            paymentDate,
            paidDays,
            lossOfPayDaysAndHour,
            basics: salary,
            incomeTax,
            loss: Loss,
            pf,
            crossEarning: crossEarn,
            totalReduction: InPfLoss,
            performanceAndSpecialAllowens,
            totalAmount: calculatedTotalAmount,
        };

        const updateData = await paySlip.findOneAndUpdate(
            { _id: req.params.id },
            updatePayload,
            { new: true }
        );

        const imagePath = path.join(__dirname, '../public/elonImage.png');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        const empDetail = await empDetails.findOne({ empId: req.body.empId });

        const htmlFile = await ejs.renderFile(path.join(__dirname, '../views/slip.ejs'), { paySlipData: updateData, emp: empDetail, imageUrl: base64Image, });

        const buffer = await generatePDF(htmlFile)
        const base64Data = buffer.toString('base64');
        console.log("54", base64Data)
        const [day, month, year] = await paymentDate.split('/')

        const updated = await basefile.findOneAndUpdate(
            { employeeId: empId, month: month, year: year }, // Search criteria
            {
                employeeId: empId,
                month: month,
                year: year,
                file: base64Data
            }, // Fields to update
            {
                new: true, // Return the updated document
                // upsert: true // Create a new document if no match is found
            }
        );

        res.status(201).json({
            message: "successfully update",
            data: updateData
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.delete = async (req, res) => {
    try {

        await paySlip.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ message: "deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}