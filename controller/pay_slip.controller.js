const paySlip = require('../model/pay_slip.model.js')
const empDetails = require('../model/emp.model.js')
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer')
require('dotenv').config()
const fs = require('fs');

const generatePDF = require('../controller/generatePdf.js');
const { info } = require('console');



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
        const { empId, salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, basics, totalReduction, crossEarning, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body
        const Loss = Math.round(lossOfPayDaysAndHour * salary / 22)
        const crossEarn = Number(performanceAndSpecialAllowens) + Number(salary)
        const InPf = Number(pf) + Number(incomeTax)
        const InPfLoss = Number(pf) + Number(incomeTax) + Loss
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPf);
        const calculatedTotalAmount = Math.round(actualSalary);
        const create = await new paySlip({
            empId,
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

        await create.save()
        const imageUrl = "http://localhost:8000/public/elonImage.png"
        const empDetail = await empDetails.findOne({ empId: req.body.empId });
        const html = await ejs.renderFile(path.join(__dirname, '../views/slip.ejs'), { paySlipData: create, emp: empDetail, imageUrl });
        const buffer = await generatePDF(html)
        const base64Data = buffer.toString('base64');

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
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email_user,
                pass: process.env.email_password
            },
        });

        const mailOptions = {
            from: process.env.email_user,
            to: [process.env.email_user],
            subject: "hi this is test process",
            text: 'This is a test email sent using Nodemailer.', 
            // html: '<h1>Hello!</h1><p>This is a test email sent using <b>Nodemailer</b>.</p>'
        };

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return console.log("error occur",error)
            }
            console.log("mail send succcessfully")
        })

        res.status(200).json("mail successfully")
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.update = async (req, res) => {
    try {
        const { empId, salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body;
        const InPfLoss = Number(pf) + Number(incomeTax) + Number(loss)

        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPfLoss);
        const calculatedTotalAmount = Math.round(actualSalary);
        const update = await paySlip.findByIdAndUpdate({ _id: req.params.id },
            {
                empId,
                salary,
                payPeriod,
                paymentDate,
                paidDays,
                lossOfPayDaysAndHour,
                incomeTax,
                loss,
                pf,
                performanceAndSpecialAllowens,
                totalAmount: calculatedTotalAmount
            },
            {
                new: true
            }
        )
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