var express = require('express');
var app = express();
var jwt = require('express-jwt')
var cors = require('cors');

app.use(cors());

var authCheck = jwt({
    secret: new Buffer('_hAw2lwJSnYxA9ErKEVSoDVR7inH2BS-QPb7teAQ95raFPWL5ItdcuVDv_xycvkQ'),
    audience: 'oGZLamMemWRBX9Kt8FaIOrLuIyZdzMV4'
});
app.get('/api/users/public', function(req, res){
    res.json({message: "Hello from a public endpoint. You do not need to be authenticated to see this."});
    console.log('Within index.js. Getting public message...');
});
app.get('/api/users/private', authCheck, function(req, res){
    res.json({message: "Hello from a private endpoint. You DO need to be authenticated to see this."});
    console.log('Within index.js. Getting private message...');
});

app.listen(3001);
console.log('App listening on http://localhost:3001...');