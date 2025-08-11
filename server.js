const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'submissions.csv');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Append data to CSV
function appendToCSV(name, title) {
    const line = `"${name}","${title}"\n`;
    fs.appendFileSync(DATA_FILE, line, 'utf8');
}

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, movie } = req.body;

    if (!name || !movie) {
        return res.status(400).json({ message: 'Name and movie/show are required' });
    }

    appendToCSV(name, movie);
    res.json({ message: 'Submission saved successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
