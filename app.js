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

   let articles = [{id:1,                                //define associative array
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
                        
                    
                ];


   res.render('index',{
        //pass value to word
         word:'Article',
         articles: articles
   });
}); 

//Add route
app.get('/articles/add',function(req,res){ 
    // res.send('Hello World.............')});
    res.render('add_articles',{
         //pass value to word
          word:'Add Articles'
    });
 });



//Start server    
app.listen(port, function(){
    console.log(`Example app listening on port ${port}!`);
});