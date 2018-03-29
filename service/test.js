const doT = require("dot");
const fs = require("fs");
const path = require("path");
const pug = require("pug");

// var tempFn = doT.template("<h1>Here is a sample template {{=it.foo}}</h1>");

// var resultText = tempFn({"type":"AAA","foo":"BB\"B"});

// console.log(resultText);

const Mustache = require("mustache");
var data ={"type":"bar","labels":["","Tesla","Mazda","Mercedes","Mini"], "users":{"A":1, "B":2}}
console.log(pug.renderFile('template.pug', {"globalConfig":data}));

