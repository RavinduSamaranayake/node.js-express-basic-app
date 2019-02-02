const express = require('express');
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');







//connect to the mongodb
mongoose.connect('mongodb://localhost/basicnodedb' ,{ useNewUrlParser: true });
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

//Add route
app.get('/articles/add',function(req,res){ 
    res.render('add_articles',{
         //pass value to word
          word:'Add Articles'
    });
 });


 //get single article and view
 app.get('/article/:id',function(req,res){     //':id' mean this is the place holder this can be any thing
     Article.findById(req.params.id, function(err,article){  //getting data from mongo db using findById method 
                                                              //and the req.params.id mean the id is getting from user request
        // console.log(article); 
        // return
        if(err){
            console.log(err);
        }

        
           
         else{
             res.render('single_article',{
               //pass values
             article: article
             }
         );
            
       }
        
    });

 });




 
 //Add Submit Post Route  and save data in db
 app.post('/articles/add',function(req,res){ 
     
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){ //save data in db
        if(err){
            console.log(err);
        }
        else{
            req.flash('success', 'Article Added');
            res.redirect('/')
           
        }
    }

    );

 });



 //Edit single article 
 app.get('/article/edit/:id',function(req,res){     //':id' mean this is the place holder this can be any thing
     Article.findById(req.params.id, function(err,article){  //getting data from mongo db using findById method 
                                                              //and the req.params.id mean the id is getting from user request
        // console.log(article); 
        // return
        if(err){
            console.log(err);
        }

        
           
         else{
             res.render('edit_articles',{
               //pass values
             article: article
             }
         );
            
       }
        
    });

 });



 

 //update data in databse
 app.post('/articles/edit/:id',function(req,res){ 
     
    let article = {};

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.update(query,article,function(err){ //update value
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });

 });



 //Delete Article 

 app.delete('/article/:id',function(req,res){ 
     
   
    let query = {_id:req.params.id}

    Article.remove(query,function(err){ //delete value
        if(err){
            console.log(err);
            return;
        }
            res.send('Success');
    });

 });






//Start server   
app.listen(port, function(){
    console.log(`Example app listening on port ${port}!`);
});
