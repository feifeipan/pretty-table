const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require("fs");
const doT = require("dot");
const path = require("path");
const mime = require("mime");
const pug = require("pug");

doT.templateSettings.strip = false;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('./public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/download', function(req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});


app.post('/update', (req, res) => {
    // console.log(req);
    var whole = req.body;
    console.log(whole);

    /**response body***
     {
    "txId": 1,
    "action": {
        "sheetName": "test1",
        "rowIndex": 10,
        "columnIndex": 23,
        "value": {
            "integer": 333,
            "valid": true
        },
        "formulaString": null
    }
    *******/

    w = whole;
    w["nv"] = parseInt(w["nv"]) * 2;

    /**do some logic part**/
    //..........
    var vd = "" , vf="";
    if(/^=/.test(w["action"]["value"]["data"])){
      vd = 1234;
      vf = w["action"]["value"]["data"];
    }else{
      vd = w["action"]["value"]["data"];
      vf = null;
    }

    var resbody = {
        "txId": w["txId"],
        "action": {
            "sheetName": w["action"]["sheetName"],
            "rowIndex": w["action"]["rowIndex"],
            "columnIndex": w["action"]["columnIndex"],
            "value": {
                "data": vd,
                "valid": false
            },
            "formulaString": vf
        }
    }
    console.log("==resbody==", resbody);
    res.end(JSON.stringify(resbody));
});

app.post("/export", (req, res, next) => {
    var req_data = req.body;
    // console.log("==data==", data);
    // var data ={"type":"bar","labels":["","Tesla","Mazda","Mercedes","Mini"], "users":{"A":1, "B":2}}
    var newContent = pug.renderFile('template.pug', { "globalConfig": req_data });
    fs.writeFileSync(path.resolve(__dirname, "public/new.html"), newContent);
    res.end("success");

    // res.attachment(path.resolve(__dirname, "./new.html"));
    // res.sendFile(path.resolve(__dirname, "./new.html"), {}, (err) => {
    //     if (err) {
    //         next(err);
    //     } else {
    //         console.log('Sent:', fileName);
    //     }
    // });

    // });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))