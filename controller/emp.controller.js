const result = require('../model/emp.model.js')
exports.getAll = async (req, res) => {
    try {
        const getEmp = await result.find()
        res.status(200).json(getEmp)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getId = async (req, res) => {
    try {
        const EmployeeDetails = await result.findById({ empId: req.params.empId })

        res.status(200).json(EmployeeDetails)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.create = async (req, res) => {
    try {
        const { empId, empName, email, empDesignation, accountNo, bankName, branch, ifscCode } = req.body
        const empCreate = await new result({
            empId,
            empName,
            email,
            empDesignation,
            accountNo,
            bankName,
            branch,
            ifscCode
        })
        await empCreate.save()
        res.status(201).json(empCreate)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { empId, empName, email, empDesignation, accountNo, bankName, branch, ifscCode } = req.body
        const updateEmp = await result.findByIdAndUpdate({ _id: req.params.id },
            {
                empId,
                empName,
                email,
                empDesignation,
                accountNo,
                bankName,
                branch,
                ifscCode
            },
            {
                new: true
            }
        )
        res.status(201).json(updateEmp)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.delete = async (req, res) => {
    try {
        await result.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ message: "deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}