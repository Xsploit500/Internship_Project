const express = require('express');
const final = require('./app');
const app = express();

app.use(express.static('app'));

app.listen(3000, () => {
    console.log("Server is listening on port 3000.")
})

app.get('/getstats', async (req, res) => {
    const stats = await final()
    res.json(stats)
})