const bcrypt = require('bcrypt');
const db = require('./db');

const createUser = `
    CREATE TABLE IF NOT EXISTS user (
        UserID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        FirstName VARCHAR(50),
        MiddleName VARCHAR(5),
        LastName VARCHAR(50),
        Suffix VARCHAR(10),
        Email VARCHAR(100) UNIQUE,
        Phone VARCHAR(20),
        Address VARCHAR(255),
        Password VARCHAR(255),
        Role VARCHAR(20),
        Status VARCHAR(10)
    )
`;

const createQuestionAnswer = `
    CREATE TABLE IF NOT EXISTS qa (
        qaID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        Question VARCHAR(255) UNIQUE,
        Answer VARCHAR(255)
    )
`;

const createStory = `
    CREATE TABLE IF NOT EXISTS story (
        StoryID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        StoryTitle VARCHAR(50),
        Description VARCHAR(255),
        Author VARCHAR(50),
        AuthorRole VARCHAR(20),
        StoryHighlights VARCHAR(255),
        ImagePath VARCHAR(255),
        Category VARCHAR(50)
    )
`;

const createAlbum = `
    CREATE TABLE IF NOT EXISTS album (
        AlbumID INT AUTO_INCREMENT PRIMARY KEY,
        AlbumTitle VARCHAR(50),
        Description VARCHAR(255),
        Year YEAR,
        Category VARCHAR(50)
    )
`;

const createAlbumImages = `
    CREATE TABLE IF NOT EXISTS album_images (
        ImageID INT AUTO_INCREMENT PRIMARY KEY,
        AlbumID INT,
        ImagePath VARCHAR(255),
        FOREIGN KEY (AlbumID) REFERENCES album(AlbumID) ON DELETE CASCADE
    )
`;

const createContactInfo = `
    CREATE TABLE IF NOT EXISTS contact (
        ContactID INT AUTO_INCREMENT PRIMARY KEY,
        Address VARCHAR(255),
        Phone VARCHAR(20),
        Network VARCHAR(20),
        Email VARCHAR(100),
        ImagePath VARCHAR(255)
    )
`;

const createBusinessHours = `
    CREATE TABLE IF NOT EXISTS business_hours (
        BusinessID INT AUTO_INCREMENT PRIMARY KEY,
        ContactID INT,
        Day VARCHAR(10),
        StartTime TIME,
        EndTime TIME,
        FOREIGN KEY (ContactID) REFERENCES contact(ContactID) ON DELETE CASCADE
    )
`;

const userData = [
    {
        email: "juan@example.com",
        password: "juan",
        role: "User"
    },
    {
        email: "pepito@example.com",
        password: "pepito",
        role: "User"
    },
    {
        email: "aliceguo@example.com",
        password: "alice",
        role: "User"
    }
];

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

const qaData = [
    {
        question: "How are you?",
        answer: "I'm fine"
    },
    {
        question: "What is the motto of Project GALA?",
        answer: "Give. Share. Be an Advocate"
    },
    {
        question: "Wait, it's all Ohio?",
        answer: "Always has been!"
    }
];

const initData = async () => {
    try {
        db.query(createUser, (err, result) => {
            if (err) {
                console.error('Error creating user table: ', err);
            } else {
                console.log('User table successfully created');
            }
        });

        db.query(createQuestionAnswer, (err, result) => {
            if (err) {
                console.error('Error creating QA table: ', err);
            } else {
                console.log('QA table successfully created');
            }
        });

        db.query(createStory, (err, result) => {
            if (err) {
                console.error('Error creating story table: ', err);
            } else {
                console.log('Story table successfully created');
            }
        });

        db.query(createAlbum, (err, result) => {
            if (err) {
                console.error('Error creating album table: ', err);
            } else {
                console.log('Album table successfully created');
            }
        });

        db.query(createAlbumImages, (err, result) => {
            if (err) {
                console.error('Error creating album images table: ', err);
            } else {
                console.log('Album images table successfully created');
            }
        });

        db.query(createContactInfo, (err, result) => {
            if (err) {
                console.error('Error creating contact table: ', err);
            } else {
                console.log('Contact table successfully created');
            }
        });

        db.query(createBusinessHours, (err, result) => {
            if (err) {
                console.error('Error creating business hours table: ', err);
            } else {
                console.log('Business hours table successfully created');
            }
        });

        for (const user of userData) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const insertUserQuery = 'INSERT IGNORE INTO user (Email, Password, Role) VALUES (?, ?, ?)';

            db.query(insertUserQuery, [user.email, hashedPassword, user.role], (err, result) => {
                if (err) {
                    console.error('Error inserting user: ', err);
                } else {
                    console.log(`User inserted successfully`);
                }
            });
        }

        for (const admin of adminData) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const insertAdminQuery = 'INSERT IGNORE INTO user (Email, Password, Role) VALUES (?, ?, ?)';

            db.query(insertAdminQuery, [admin.email, hashedPassword, admin.role], (err, result) => {
                if (err) {
                    console.error('Error inserting admin: ', err);
                } else {
                    console.log(`Admin inserted successfully`);
                }
            });
        }

        for (const qa of qaData) {
            const insertQaQuery = 'INSERT IGNORE INTO qa (Question, Answer) VALUES (?, ?)';
            
            db.query(insertQaQuery, [qa.question, qa.answer], (err, result) => {
                if (err) {
                    console.error('Error inserting Q&A: ', err);
                } else {
                    console.log(`Q&A inserted successfully`);
                }
            });
        }
    } catch (error) {
        console.error('Error initializing data: ', error);
    }
};

module.exports = initData;
