const paySlip = require('../model/pay_slip.model.js')

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
        const { salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body
        const InPfLoss = Number(pf) + Number(incomeTax) + Number(loss)
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPfLoss);
        const calculatedTotalAmount = Math.round(actualSalary);
        const create = await new paySlip({
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
        res.status(201).json(create)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { salary, payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, loss, pf, performanceAndSpecialAllowens, totalAmount } = req.body;
        const InPfLoss = Number(pf) + Number(incomeTax) + Number(loss)
        const actualSalary = salary - (lossOfPayDaysAndHour * salary / 22) + (performanceAndSpecialAllowens - InPfLoss);
        const calculatedTotalAmount = Math.round(actualSalary);
        const update = await paySlip.findByIdAndUpdate({ _id: req.params.id },
            {
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