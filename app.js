const express = require('express');
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');



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


//Home route
app.get('/',function(req,res){ 

  /* let articles = [{id:1,                                //define associative array
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



//Start server    
app.listen(port, function(){
    console.log(`Example app listening on port ${port}!`);
});

