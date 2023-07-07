// Libraries that are required for initial setup
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jsforce=require('jsforce')
// Libraries that are required for initial setup


//Routes used in the app
const loginRoutes = require('./routes/loginRoutes');
const accountRoutes = require('./routes/accountRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');
const contentRoutes = require('./routes/contentRoutes');
const recommendationRoutes=require('./routes/recommendation')
const salesOrderRoutes = require('./routes/salesOrder');
const marketInventoryRoutes = require('./routes/marketInventoryRoutes');
const liquidRoutes=require('./routes/liquidRoutes');
const outlet360Routes=require('./routes/outlet-360')
//Routes used in the app



//Creating an express app
const app = express();
//Creating an express app


// Serving your app on the client browser
app.use(express.static(path.join(__dirname,'public')));

// Body parser for fetching request body through fetch 
app.use(bodyParser.json({limit : '50mb'}));

// for CORS Setup code 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
// for CORS setup code 


//Routing the incoming request
app.use(loginRoutes);
app.use(accountRoutes);
app.use(eventRoutes);
app.use(reportRoutes);
app.use(contentRoutes);
app.use(recommendationRoutes)
app.use(salesOrderRoutes);
app.use(marketInventoryRoutes);
app.use(liquidRoutes);
app.use(outlet360Routes);
//Routing the incoming request

// Initial setup for index page
app.use('/',(req,res,next) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});


app.listen(process.env.PORT || 3400);
