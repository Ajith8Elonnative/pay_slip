const paySlip = require('../model/pay_slip.model.js')
const empDetails = require('../model/emp.model.js')
const ejs = require('ejs')
const puppeteer = require('puppeteer')
const path = require('path');
const fs = require('fs');
exports.getAll = async (req, res) => {
    try {
        const get = await paySlip.find()
        res.status(200).json(get)
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}


exports.create = async (req, res) => {
    try {
        const { empId,salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body
        const InPfLoss = Number(pf) + Number(incomeTax) + Number(loss)
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPfLoss);
        const calculatedTotalAmount = Math.round(actualSalary);
        const create = await new paySlip({
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
            totalAmount:calculatedTotalAmount,
        })
        
        await create.save()
        const paySlipData = create
        const emp = await empDetails.findOne({ empId: req.body.empId });
        if (!paySlipData || !emp) {
            return res.status(404).json({ message: "Employee or Pay Slip data not found" });
        }
        return res.render('slip', { paySlipData, emp });

        // const html = await ejs.renderFile(path.join(__dirname, '../views/slip.ejs'), { paySlipData, emp });
       
        //   // Use Puppeteer to convert HTML to PDF
        //   const browser = await puppeteer.launch();
        //   const page = await browser.newPage();
        //   await page.setContent(html, { waitUntil: 'networkidle0' });
  
        //   // Generate PDF with Puppeteer
        //   const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        //   await browser.close();
  
        //   // Set PDF headers
        //   res.contentType("application/pdf");
        //   res.setHeader("Content-Disposition", "attachment; filename=pay_slip.pdf");
        //   res.send(pdfBuffer);
        // res.render('slip', { paySlipData, emp });
        // fs.writeFileSync("test_pay_slip.pdf", pdfBuffer);
        
       
        
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

exports.update = async (req, res) => {
    try {
        const { empId, salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body;
        const InPfLoss = Number(pf) + Number(incomeTax) + Number(loss)
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPfLoss);
        const calculatedTotalAmount = Math.round(actualSalary);
        const update = await paySlip.findByIdAndUpdate({ _id: req.params.id},
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
                totalAmount:calculatedTotalAmount
            },
            {
                new: true
            }
        )
        res.status(201).json(update)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

exports.delete = async (req, res) => {
    try {

        await paySlip.findByIdAndDelete({ _id: req.params.id})
        res.status(200).json({ message: "deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}