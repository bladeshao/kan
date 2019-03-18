var express = require('express');
var app = express();

var folder = __dirname + "\\src";
app.use(express.static(folder));

app.listen(process.env.PORT || 3000);