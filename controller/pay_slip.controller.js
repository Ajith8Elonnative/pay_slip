const paySlip = require('../model/pay_slip.model.js')
const empDetails = require('../model/emp.model.js')
const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');



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
            totalReduction:InPfLoss,
            performanceAndSpecialAllowens,
            totalAmount: calculatedTotalAmount,
        })

        await create.save()
        const empDetail = await empDetails.findOne({ empId: req.body.empId });
        const html = await ejs.renderFile( path.join(__dirname, '../views/slip.ejs'), { paySlipData: create, emp: empDetail });
        // res.status(200).render('slip', { paySlipData: create, emp: empDetail })
        // Launch puppeteer and convert HTML to PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Save the PDF to a buffer
        const pdfBuffer = await page.pdf({ format: 'A4' });

        // Close browser instance
        await browser.close();

        // Send the PDF buffer as a response
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': 'attachment; filename="paySlip.pdf"',
        });
        const base64 = Buffer.from(pdfBuffer).toString('base64');
        
        res.status(201).json(base64);

    } catch (error) {
        res.status(500).json({ message: error.message })
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