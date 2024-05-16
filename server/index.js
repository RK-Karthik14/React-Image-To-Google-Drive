const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const multer = require('multer');
const { Readable } = require('stream');
const pool = require('./db'); // Assuming you have a database connection

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer();
const port = 3000;
const apiKeys = require('./api.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apiKeys.client_email,
    null,
    apiKeys.private_key,
    SCOPES
  );
  await jwtClient.authorize();
  return jwtClient;
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/register', upload.single('file'), async (req, res) => {
  try {
    const { name, age } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const fileMetadata = {
      name: file.originalname,
      parents: ["1FF3ZmbKXwTYL1-0_gOPtEkfJzYB39fQQ"]
    };

    const media = {
      mimeType: file.mimetype,
      body: Readable.from([file.buffer]) // Convert buffer to readable stream
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    const fileId = driveResponse.data.id;
    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    const query = 'INSERT INTO users (name, age, image) VALUES ($1, $2, $3)';
    const values = [name, age, fileUrl];
    await pool.query(query, values);

    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Error uploading file to Google Drive");
  }
});
