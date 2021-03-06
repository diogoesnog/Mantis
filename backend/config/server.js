// Loading modules
const createError   = require('http-errors');
// Express server
const express       = require('express');
const app           = express();
// Handle CORS
const cors          = require('cors');
// Body Parser
const bodyParser    = require('body-parser');
// Cookie Parser
const cookieParser  = require('cookie-parser');
// Morgan For Request Status
const logger        = require('morgan');
// MongoDB
const mongoose      = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(() => {
        console.log("Connection to MongoDB successfully established")
    })
    .catch(() => {
        throw new Error("Could not establish connection to MongoDB");
    });

// Display Request Status
const env = process.argv[2];
if(env === 'dev')
    app.use( logger(env) );
else if( env === 'production') 
    console.log = function(){ /* Do NOTHING - prevent logs under production */ };

// Tell node where public files are located
app.use(express.static('./app/public'));

// Setup EJS View Engine
app.set('view engine', 'ejs');
app.set('views', './app/views');

// urlencoded tells body-parser to extract data from <from>
app.use(bodyParser.urlencoded({
    extended: true
}));

// To read it in JSON
app.use(bodyParser.json());

// Use cookies
app.use(cookieParser());

// Configure CORS
const corsOptions = {
    origin: process.env.FRONTEND_SERVER,
    credentials: true,
};

app.use(cors(corsOptions));

// Define Routes
const ProcessoRoutes = require('../app/routes/processo');
const UniversidadeRoutes = require('../app/routes/universidade');
const UserRoutes = require('../app/routes/user');

app.use('/processo', ProcessoRoutes);
app.use('/universidade', UniversidadeRoutes);
app.use('/user', UserRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.jsonp({title: "Error!", message: err.message});
});

// Module Export
module.exports = app;
