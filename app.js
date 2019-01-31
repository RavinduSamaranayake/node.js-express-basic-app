const express = require('express');
const path = require('path');
const port = 3000;

//initialize app
const app = express();

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', `pug`);


//Home route
app.get('/',function(req,res){ 
   // res.send('Hello World.............')});
   res.render('index'); //view index.pug
});


//Start server    
app.listen(port, function(){
    console.log(`Example app listening on port ${port}!`);
});