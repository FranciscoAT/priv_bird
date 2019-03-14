const express = require('express');
const IBE = require('ibejs');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;

let ibe = new IBE();
let accept = true;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/getpkey', (req, res) => {
    if (accept) {
        let xml = req.body.xml;
        console.log(xml);
        res.send(
            {
                pkey: ibe.getPrivateKey(xml),
                status: true
            }
        );
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log("Someting went wrong.", err);
    }

    console.log(`Now listening on port ${port}, go to http://localhost:${port}`);
});