const slip = require('../model/monthly_slip.model.js')




exports.getSlip = async (req, res) => {
    try {
        const { employeeId, month, year } = req.query
        const paySlipRetrieve = await slip.findOne({ employeeId, month, year });

        if (!paySlipRetrieve) {
            return res.status(404).json({
                message: "Data not found"
            });
        }

        res.status(200).json(paySlipRetrieve.file)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}