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
        const { payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, loss, pf, performanceAndSpecialAllowens, tatalAmount } = req.body
        const create = await new paySlip({
            payPeriod,
            paymentDate,
            paidDays,
            lossOfPayDaysAndHour,
            incomeTax,
            loss,
            pf,
            performanceAndSpecialAllowens,
            tatalAmount
        })
        await create.save()
        res.status(201).json(create)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { payPeriod, paymentDate, paidDays, lossOfPayDaysAndHour, incomeTax, loss, pf, performanceAndSpecialAllowens, tatalAmount } = req.body;
        const update = await paySlip.findByIdAndUpdate({_id:req.params.id},
            {
                payPeriod,
                paymentDate,
                paidDays,
                lossOfPayDaysAndHour,
                incomeTax,
                loss,
                pf,
                performanceAndSpecialAllowens,
                tatalAmount  
            },
            {
                new:true
            }
        ) 
        res.status(201).json(update)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.delete = async (req, res) => {
    try {
        const id=req.params.id
        paySlip.findByIdAndDelete({_id:id})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}