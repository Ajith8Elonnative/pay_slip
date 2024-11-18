const paySlip = require('../model/pay_slip.model.js')
const empDetails = require('../model/emp.model.js')
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer')
require('dotenv').config()
const fs = require('fs');
const generatePDF = require('../controller/generatePdf.js');
const { info } = require('console');
const basefile = require('../model/monthly_slip.model.js')



exports.getAll = async (req, res) => {
    try {
        const get = await paySlip.find()
        res.status(200).json(get)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


exports.create = async (req, res) => {
    try {
        const { empId,empName, salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, basics, totalReduction, crossEarning, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body
        const Loss = Math.round(lossOfPayDaysAndHour * salary / 22)
        const crossEarn = Number(performanceAndSpecialAllowens) + Number(salary)
        const InPf = Number(pf) + Number(incomeTax)
        const InPfLoss = Number(pf) + Number(incomeTax) + Loss
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPf);
        const calculatedTotalAmount = Math.round(actualSalary);
        const create = await new paySlip({
            empId,
            empName,
            salary,
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
        const search = await paySlip.findOne({empId:empId}) 
        if(!search){
            await create.save()
        }else{
            res.json({
               message:"This id already exsits" 
            })
        }
        
        const imagePath = path.join(__dirname, '../public/elonImage.png');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

        const empDetail = await empDetails.findOne({ empId: req.body.empId });
       
        const html = await ejs.renderFile(path.join(__dirname, '../views/slip.ejs'), { paySlipData: create, emp: empDetail,  imageUrl: base64Image, });
        const buffer = await generatePDF(html)
        const base64Data = buffer.toString('base64');
        const [day, month, year] =await paymentDate.split('/')
        const pdfBase = await new basefile({
            file:base64Data,
            employeeId:empId,
            month:month,
            year:year
        })
        const validId = await basefile.findOne({empId:empId}) 
        if(!validId){
            await pdfBase.save()
        }
        es.status(201).json({
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
        const pdfBuffer = fs.readFileSync('./output.pdf');

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email_user,
                pass: process.env.email_password
            },
        });

        const mailOptions = {
            from: process.env.email_user,
            to: [req.params.email,

            ],
            subject: "hi this is test process",
            text: 'This is a test email sent using Nodemailer.', 
            html: '<h1>Hello!</h1><p>This is a test email sent using <b>Nodemailer</b>.</p>',
            attachments: [
                {
                    filename: 'output.pdf', // File name to be shown in email
                    content: pdfBuffer, // File content
                    contentType: 'application/pdf', // MIME type of the attachment
                },
            ],
        };

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return console.log("error occur",error)
            }
            console.log("mail send succcessfully")
        })
        await fs.unlink('./output.pdf', (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File successfully deleted!');
            }
        });
        res.status(200).json("mail successfully")
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


exports.update = async (req, res) => {
    try {
        const { empId,empName, salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, basics, totalReduction, crossEarning, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body
        const Loss = Math.round(lossOfPayDaysAndHour * salary / 22)
        const crossEarn = Number(performanceAndSpecialAllowens) + Number(salary)
        const InPf = Number(pf) + Number(incomeTax)
        const InPfLoss = Number(pf) + Number(incomeTax) + Loss
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPf);
        const calculatedTotalAmount = Math.round(actualSalary);
        const update = await paySlip.findByIdAndUpdate({ _id: req.params.id },
            {
                empId,
                empName,
                salary,
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
            },
            {
                new: true
            }
        )
        const imagePath = path.join(__dirname, '../public/elonImage.png');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        const empDetail = await empDetails.findOne({ empId: req.body.empId });
        const html = await ejs.renderFile(path.join(__dirname, '../views/slip.ejs'), { paySlipData: create, emp: empDetail,  imageUrl: base64Image, });
        const buffer = await generatePDF(html)
        const base64Data = buffer.toString('base64');

        const [day, month, year] =await paymentDate.split('/')
        const pdfBase = await new basefile({
            file:base64Data,
            employeeId:empId,
            month:month,
            year:year
        })
        const validId = await basefile.findOne({empId:empId}) 
        if(!validId){
            await pdfBase.save()
        }
        res.status(201).json(update)
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