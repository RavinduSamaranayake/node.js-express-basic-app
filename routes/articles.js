const express = require('express');
const router = express.Router();

//bring in Article model
let Article = require('../models/article'); //we use .. cause of model is out of the route folder

//bring in User model
let User = require('../models/user');


//Add route
router.get('/add',ensureAuthenticated,function(req,res){ 
    res.render('add_articles',{
         //pass value to word
          word:'Add Articles'
    });
 });



 
 //Add Submit Post Route  and save data in db
 router.post('/add',function(req,res){ 
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_articles', {
      title:'Add Article',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id; //to set the user id for author
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  } 
    
 });



 //Edit single article 
 router.get('/edit/:id',function(req,res){     //':id' mean this is the place holder this can be any thing
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
 router.post('/edit/:id',function(req,res){ 
    
    
     
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

 router.delete('/:id',function(req,res){ 
     
   
    let query = {_id:req.params.id}

    Article.remove(query,function(err){ //delete value
        if(err){
            console.log(err);
            return;
        }
            res.send('Success');
    });

 });


 //get single article and view
 router.get('/:id',function(req,res){     //':id' mean this is the place holder this can be any thing
     Article.findById(req.params.id, function(err,article){  //getting data from mongo db using findById method 
        User.findById(article.author, function(err,user){     //the user is a article author                                                 //and the req.params.id mean the id is getting from user request
        // console.log(article); 
        // return
       
             res.render('single_article',{
               //pass values
             article: article,
             author: user.name

             }
         );
            
       }
        
    );
  });
});


// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}




 module.exports = router; //actually we can access the router from out side
