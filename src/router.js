const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const upload = require('./upload');

router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('An error occurred during logout');
        }
        res.redirect('/index.html');
    });
});

router.get('/allUsers', async (req, res) => {
    try {
        const userQuery = 'SELECT * FROM user';
        const results = await query(userQuery);
        res.json({ success: true, data: results });
    } catch (err) {
        console.error('Error fetching Q&A:', err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the Q&A' });
    }
});

router.get('/allQA', async (req, res) => {
    try {
        const qaQuery = 'SELECT * FROM qa';
        const results = await query(qaQuery);
        res.json({ success: true, data: results });
    } catch (err) {
        console.error('Error fetching Q&A:', err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the Q&A' });
    }
});

router.get('/allStories', async (req, res) => {
    try {
        const storiesQuery = 'SELECT * FROM story';
        const stories = await query(storiesQuery);

        stories.forEach(story => {
            story.images = [story.ImagePath];
        });

        res.json({ success: true, stories: stories });
    } catch (err) {
        console.error('Error fetching stories:', err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching stories' });
    }
});

router.get('/allAlbums', async (req, res) => {
    try {
        const albumsQuery = 'SELECT * FROM album';
        const albums = await query(albumsQuery);

        const albumsWithImages = await Promise.all(albums.map(async album => {
            const imagesQuery = 'SELECT ImagePath FROM album_images WHERE AlbumID = ?';
            const images = await query(imagesQuery, [album.AlbumID]);
            album.images = images.map(image => image.ImagePath);
            return album;
        }));

        res.json({ success: true, albums: albumsWithImages });
    } catch (err) {
        console.error('Error fetching albums:', err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching albums' });
    }
});

router.get('/getAlbum/:id', async (req, res) => {
    try {
        const albumId = req.params.id;
        const albumQuery = 'SELECT * FROM album WHERE AlbumID = ?';
        const results = await query(albumQuery, [albumId]);
        if (results.length > 0) {
            res.json({ success: true, album: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Album not found' });
        }
    } catch (err) {
        console.error('Error fetching album:', err);
        res.status(500).json({ success: false, message: 'An error occurred while fetching the album' });
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT * FROM user WHERE Email = ? AND Role = ?';
        const results = await query(sql, [email, 'User']);
        
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.Password);
        if (match) {
            req.session.userId = user.Id;
            res.redirect('/home.html');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send('An error occurred during login');
    }
});

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = 'SELECT * FROM user WHERE Email = ? AND Role = ?';
        const results = await query(sql, [email, 'Admin']);
        
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.Password);
        if (match) {
            req.session.userId = user.Id;
            res.redirect('/home_admin.html');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send('An error occurred during login');
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, mi, lastName, suffix, email, phone, address, createPassword } = req.body;
        
        const checkEmailQuery = 'SELECT * FROM user WHERE Email = ?';
        const results = await query(checkEmailQuery, [email]);
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email address.' });
        } else {
            const hashedPassword = await bcrypt.hash(createPassword, 10);
            const insertUserQuery = 'INSERT INTO user (FirstName, MiddleName, LastName, Suffix, Email, Phone, Address, Password, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            await query(insertUserQuery, [firstName, mi, lastName, suffix, email, phone, address, hashedPassword, 'User']);
            res.redirect('/');
        }
    } catch (err) {
        res.status(500).send('An error occurred during registration');
    }
});

router.post('/verify-email', (req, res) => {
    const { email } = req.body;
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Email not found' });
        } else {
            const userId = results[0].UserID;
            res.json({ success: true, message: 'Unique key sent to your email', userId });
        }
    });
});

router.post('/reset-password', (req, res) => {
    const { userId, uniqueKey, newPassword } = req.body;
    db.query('UPDATE user SET password = ? WHERE id = ? AND reset_key = ?', [newPassword, userId, uniqueKey], (err, results) => {
        if (err) {
            console.error('Error updating password:', err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }

        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Password reset successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Invalid user or key' });
        }
    });
});

router.post('/uploadImage', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path;
        res.json({ success: true, imagePath });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ success: false, message: 'An error occurred while uploading image' });
    }
});

router.post('/addQA', async (req, res) => {
    try {
        const { question, answer } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({ success: false, message: 'Question and answer are required' });
        }

        const insertQAQuery = 'INSERT INTO qa (Question, Answer) VALUES (?, ?)';
        await query(insertQAQuery, [question, answer]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error adding Q&A:', err);
        res.status(500).json({ success: false, message: 'An error occurred while adding the Q&A' });
    }
});

router.post('/addStory', async (req, res) => {
    try {
        const { title, description, author, role, highlights, category, images } = req.body;

        const insertStoryQuery = 'INSERT INTO story (StoryTitle, Description, Author, AuthorRole, StoryHighlights, Category, ImagePath) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await query(insertStoryQuery, [title, description, author, role, highlights, category, images]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error adding story:', err);
        res.status(500).json({ success: false, message: 'An error occurred while adding the story' });
    }
});

router.post('/addAlbum', async (req, res) => {
    try {
        const { title, description, year, category, images } = req.body;

        const insertAlbumQuery = 'INSERT INTO album (AlbumTitle, Description, Year, Category) VALUES (?, ?, ?, ?)';
        const result = await query(insertAlbumQuery, [title, description, year, category]);
        const albumId = result.insertId;

        if (images && images.length > 0) {
            const insertImageQuery = 'INSERT INTO album_images (AlbumID, ImagePath) VALUES (?, ?)';
            const insertPromises = images.map(imagePath => query(insertImageQuery, [albumId, imagePath]));
            await Promise.all(insertPromises);
        }

        res.json({ success: true, albumId });
    } catch (err) {
        console.error('Error adding album:', err);
        res.status(500).json({ success: false, message: 'An error occurred while adding the album' });
    }
});

router.post('/addContact', async (req, res) => {
    try {
        const { address, number, network, email, images } = req.body;

        const insertContactQuery = 'INSERT INTO contact (Address, Phone, Network, Email, ImagePath) VALUES (?, ?, ?, ?, ?)';
        await query(insertContactQuery, [address, number, network, email, images]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error adding contact:', err);
        res.status(500).json({ success: false, message: 'An error occurred while adding the contact' });
    }
});

router.put('/editQA/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({ success: false, message: 'Question and answer are required' });
        }

        const updateQAQuery = 'UPDATE qa SET Question = ?, Answer = ? WHERE qaID = ?';
        await query(updateQAQuery, [question, answer, id]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error editing Q&A:', err);
        res.status(500).json({ success: false, message: 'An error occurred while editing the Q&A' });
    }
});

router.put('/editStory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, author, authorRole, highlights, category } = req.body;

        const updateStoryQuery = 'UPDATE story SET StoryTitle = ?, Description = ?, Author = ?, AuthorRole = ?, StoryHighlights = ?, Category = ? WHERE StoryID = ?';
        await query(updateStoryQuery, [title, description, author, authorRole, highlights, category, id]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error editing story:', err);
        res.status(500).json({ success: false, message: 'An error occurred while editing the story' });
    }
});

router.put('/editAlbum/:id', async (req, res) => {
    try {
        const albumId = req.params.id;
        const { title, description, year, category } = req.body;

        const updateAlbumQuery = 'UPDATE album SET AlbumTitle = ?, Description = ?, Year = ?, Category = ? WHERE AlbumID = ?';
        await query(updateAlbumQuery, [title, description, year, category, albumId]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating album:', err);
        res.status(500).json({ success: false, message: 'An error occurred while updating the album' });
    }
});

router.delete('/deleteQA/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleteQAQuery = 'DELETE FROM qa WHERE qaID = ?';
        await query(deleteQAQuery, [id]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting Q&A:', err);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the Q&A' });
    }
});

router.delete('/deleteStory/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleteStoryQuery = 'DELETE FROM story WHERE StoryID = ?';
        await query(deleteStoryQuery, [id]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting story:', err);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the story' });
    }
});

router.delete('/deleteAlbum/:id', async (req, res) => {
    try {
        const albumId = req.params.id;

        const deleteImagesQuery = 'DELETE FROM album_images WHERE AlbumID = ?';
        await query(deleteImagesQuery, [albumId]);

        const deleteAlbumQuery = 'DELETE FROM album WHERE AlbumID = ?';
        await query(deleteAlbumQuery, [albumId]);

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting album:', err);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the album' });
    }
});


module.exports = router;
