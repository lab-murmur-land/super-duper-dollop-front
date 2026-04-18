const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Send all other requests to index.html to prevent 404s when navigating directly 
// (assuming you want index.html as a fallback, though since we use physical HTML files like login.html, this is just for safety)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`\n\x1b[32m[TERMINAL NOIR]\x1b[0m SIGNAL ACTIVE ON PORT ${port}`);
    console.log(`\x1b[36m>> NODE CONNECTION: http://localhost:${port}\x1b[0m\n`);
});
