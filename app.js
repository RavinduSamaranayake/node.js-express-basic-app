const express = require('express');
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



//connect to the mongodb
mongoose.connect('mongodb://localhost/basicnodedb');
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


//set public folder statically
app.use(express.static(path.join(__dirname,'public')));


//Home route
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
                 articles: arti
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



 
 //Add Submit Post Route
 app.post('/articles/add',function(req,res){ 
     
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/')
           
        }
    }

    );

 });



//Start server    
app.listen(port, function(){
    console.log(`Example app listening on port ${port}!`);
});

