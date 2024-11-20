const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/allQuotes', (req, res) => {
  res.json([
    { _id: 1, author: 'Author A', text: 'Quote A' },
    { _id: 2, author: 'Author B', text: 'Quote B' }
  ]);
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
