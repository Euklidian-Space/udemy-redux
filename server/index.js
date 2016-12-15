const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//DB setup
mongoose.connect('mongodb://localhost:auth/auth');

//app setup
app.use(morgan('combined'));

// cors() takes options if you want to white list the domains
// that can access your api
app.use(cors());


app.use(bodyParser.json({ type: '*/*' }));
router(app);

//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on ' + port);
