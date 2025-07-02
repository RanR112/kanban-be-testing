const prisma = require("./client");

async function main() {
    await prisma.user.createMany({
        data: [
            // {
            //     id_users: 1,
            //     id_department: 1,
            //     name: "Randy Rafael",
            //     role: "ADMIN",
            //     email: "randyrafael112@gmail.com",
            //     no_hp: "081255802706",
            //     password:
            //         "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
            //     email_verified: true,
            // },
            // {
            //     id_users: 2,
            //     id_department: 1,
            //     name: "Administrator",
            //     role: "ADMIN",
            //     email: "admin@gmail.com",
            //     no_hp: "08123456789",
            //     password:
            //         "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
            //     email_verified: true,
            // },
            {
                id_users: 3,
                id_department: 1,
                name: "Manager PC",
                role: "MANAGER",
                email: "managerpc@gmail.com",
                no_hp: "08123456789",
                password:
                    "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
                email_verified: true,
            },
            {
                id_users: 4,
                id_department: 1,
                name: "Supervisor PC",
                role: "SUPERVISOR",
                email: "supervisorpc@gmail.com",
                no_hp: "08123456789",
                password:
                    "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
                email_verified: true,
            },
            {
                id_users: 5,
                id_department: 1,
                name: "Staff",
                role: "STAFF",
                email: "staff@gmail.com",
                no_hp: "08123456789",
                password:
                    "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
                email_verified: true,
            },
            {
                id_users: 6,
                id_department: 2,
                name: "Manager QC",
                role: "MANAGER",
                email: "manager@gmail.com",
                no_hp: "08123456789",
                password:
                    "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
                email_verified: true,
            },
            {
                id_users: 7,
                id_department: 2,
                name: "Supervisor QC",
                role: "SUPERVISOR",
                email: "supervisor@gmail.com",
                no_hp: "08123456789",
                password:
                    "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
                email_verified: true,
            },
            {
                id_users: 8,
                id_department: 2,
                name: "Leader QC",
                role: "LEADER",
                email: "leader@gmail.com",
                no_hp: "08123456789",
                password:
                    "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
                email_verified: true,
            },
            {
                id_users: 9,
                id_department: 2,
                name: "User QC",
                role: "USER",
                email: "user@gmail.com",
                no_hp: "08123456789",
                password:
                    "$2a$12$YPzTDmUuh.2v1MGltiWLWuoGH8yZQMl1lXWyU3QYdUrdD/YblxfGO",
                email_verified: true,
            },
        ],
    });

    console.log("✅ Seeding selesai!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
