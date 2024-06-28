const bcrypt = require('bcrypt');
const db = require('./db');

const adminData = [
    {
        email: "admin1@example.com",
        password: "admin1",
        role: "Admin"
    },
    {
        email: "admin2@example.com",
        password: "admin2",
        role: "Admin"
    },
    {
        email: "admin3@example.com",
        password: "admin3",
        role: "Admin"
    }
];

const initData = async () => {
    try {
        for (const admin of adminData) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const insertAdminQuery = 'INSERT IGNORE INTO user (Email, Password, Role) VALUES (?, ?, ?)';

            db.query(insertAdminQuery, [admin.email, hashedPassword, admin.role], (err, result) => {
                if (err) {
                    console.error('Error inserting admin user: ', err);
                } else {
                    console.log('Admin user inserted successfully');
                }
            });
        }
    } catch (error) {
        console.error('Error hashing password: ', error);
    }
};

module.exports = initData;
