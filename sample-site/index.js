const express = require('express');
const fs = require('fs');
const path = require('path');
const expresshbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

var currentXML = 'default.xml';
var p3pDir = './p3p-files';

app.engine('.hbs', expresshbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    p3pFiles = getDirFileNames(p3pDir);
    res.render('index', {
        p3pFiles: p3pFiles,
        currentp3p: currentXML
    });
});

app.post('/', (req, res) => {
    currentXML = req.body.newp3pfile;
    console.log(`Setting new XML file to ${currentXML}`);
});

function getDirFileNames(dirName) {
    p3pFiles = []
    fs.readdirSync(dirName).forEach(file => {
        p3pFiles.push(file);
    });
    return p3pFiles;
}

app.get('/p3p.xml', (req, res) => {
    var docToSend = `${p3pDir}/${currentXML}`;
    var contents = fs.readFileSync(docToSend, 'UTF-8');
    res.set('Content-Type', 'text/xml');
    res.send(contents);
});

app.listen(port, (err) => {
    if (err) {
        return console.log("Something went wrong.", err);
    }

    console.log(`Now listening on port ${port}, go to http://localhost:${port}`);
});