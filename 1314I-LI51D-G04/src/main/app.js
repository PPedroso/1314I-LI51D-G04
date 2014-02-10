var express = require('express'),
    routing = require('./Config/Routing.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    configDB = require('./config/Database.js'),
    configPassport = require('./config/Passport.js'),
    flash = require('connect-flash');


mongoose.connect(configDB.url);
configPassport(passport);

var app = express();

//general configurations
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(flash());

//view related configs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/View');
app.use(express.static(__dirname + '/Public'));

//passport related
app.use(express.session({ secret: 'RealEstate is the way to go' }));
app.use(passport.initialize());
app.use(passport.session());

//routing
routing.applyRouting(app, passport);

//logging configuration
    //for console
    app.use(express.logger("dev"));
    //into file

app.listen(8000);
