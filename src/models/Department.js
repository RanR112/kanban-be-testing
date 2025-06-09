const prisma = require("../../prisma/client");

class Department {
    static async findById(id) {
        return await prisma.department.findUnique({
            where: { id_department: parseInt(id) }
        });
    }

    static async exists(id) {
        const department = await this.findById(id);
        return !!department;
    }
}

module.exports = Department;