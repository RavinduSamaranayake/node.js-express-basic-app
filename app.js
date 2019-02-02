const express = require('express');
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');







//connect to the mongodb
mongoose.connect('mongodb://localhost/basicnodedb' );
let db = mongoose.connection;

//initialize app
const app = express();

//check connection
db.once('open',function(){
    console.log('Conneted to mongodb........');
});

//Check for db errors
db.on('error',function(err){
    console.log(err);
});

//bring in models
let Article = require('./models/article');



//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', `pug`);



//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,  //to active resave put the true
    saveUninitialized: true,
     
  }))



  //Express Message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));


//set public folder statically
app.use(express.static(path.join(__dirname,'public')));


//Home route and load the all aricles to page
app.get('/',function(req,res){ 

  /* let articles = [{id:1,                                
                    title:'article one',
                    author:'kushan ravindu',
                    body:'this is article 1'},

                    {id:2,
                     title:'article two',
                     author:'kushan ravindu',
                     body:'this is article 2'},

                    {id:3,
                     title:'article three',
                     author:'kushan ravindu',
                     body:'this is article 3'}
                        
                    
                ];   */

    Article.find({},function(err,arti){  //get all vlues from article table
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                //pass value to word
                 word:'Article',
                 articles: arti //set the all articles for articles
            })
        }
  
   });
}); 

//Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles',articles); //in here when we use this command, we can use articles.js file instead of '/articles' path 
app.use('/users',users);

//Start server   
app.listen(port, function(){
    console.log(`Example app listening on port ${port}!`);
});
