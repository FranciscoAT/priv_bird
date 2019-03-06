const express = require('express');
const fs = require('fs');
const path = require('path');
const expresshbs = require('express-handlebars');
const bodyParser = require('body-parser');
const IBE = require('ibejs');
const request = require('request');

const app = express();
const port = 3000;

let ibe = new IBE();
var currentXML = 'default.xml';
var p3pDir = './p3p-files';
var sec_key;

app.engine('.hbs', expresshbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Privacy Bird Middleware
app.post('*', (req, res, next) => {
    let data = parseInput(req.body);
    if (!data) {
        res.locals.data = req.body;
    } else {
        res.locals.data = convertArrToJson(decrypt(data));
    }
    next();
});

app.get('/', (req, res) => {
    p3pFiles = getDirFileNames(p3pDir);
    res.render('index', {
        p3pFiles: p3pFiles,
        currentp3p: currentXML
    });
});

app.post('/', (req, res) => {
    currentXML = res.locals.data.newp3pfile;
    updateKeys(currentXML);
    console.log(`Setting new XML file to ${currentXML}`);
    res.redirect('/');
});

app.get('/p3p.xml', (req, res) => {
    var contents = getP3PFile(currentXML);
    res.set('Content-Type', 'text/xml');
    res.send(contents);
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.post('/form', (req, res) => {
    let formData = parseInput(req.body);
    let decData = res.locals.data;
    res.render('submit', {
        formData: JSON.stringify(formData, undefined, 2),
        decData: JSON.stringify(decData, undefined, 2)
    });
});

app.listen(port, (err) => {
    if (err) {
        return console.log("Something went wrong.", err);
    }

    console.log(`Now listening on port ${port}, go to http://localhost:${port}`);
    updateKeys(currentXML);
});

function parseInput(data) {
    if ('enc-data' in data) {
        return JSON.parse(data['enc-data']);
    } else {
        return false;
    }
}

function decrypt(data) {
    if (!'encMsg' in data) {
        return data;
    } 

    let dec_data = ibe.decrypt(sec_key, data);
    return JSON.parse(dec_data);
}

function updateKeys(p3pFile) {
    let xml = getP3PFile(p3pFile);

    request.post(
        'http://localhost:3030/getpkey',
        { form: {
            xml: xml
        }},
        (err, httpres, body) => {
            body = JSON.parse(body);
            sec_key = body.pkey;
        }
    );

    console.log(sec_key);

    console.log(`Updated private key using xml file ${currentXML}`);
}

function getP3PFile(p3pFile) {
    return fs.readFileSync(`${p3pDir}/${p3pFile}`);
}

function getDirFileNames(dirName) {
    p3pFiles = []
    fs.readdirSync(dirName).forEach(file => {
        p3pFiles.push(file);
    });
    return p3pFiles;
}

function convertArrToJson(arrIn) {
    console.log(arrIn);
    let newJSON = {};
    for (let i = 0; i < arrIn.length; i++) {
        let tempObj = arrIn[i];
        newJSON[tempObj.name] = tempObj.value;
    }
    return newJSON;
}