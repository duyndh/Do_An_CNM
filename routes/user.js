var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../model/user');
var Transaction = require('../model/transaction');


var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', function(req,res,next){
	res.render('user/profile');
});
router.get('/logout',isLoggedIn, function(req, res,next){
  req.logout();
  res.redirect('/');
});

router.get('/dashboard',isLoggedIn, function(req, res,next){
  var id = req.user.transaction_id;
  var user_usable_balance = 0;
  var user_current_balance = 0;
  var transaction = Transaction.findById(req.user.transaction_id,function(err,data){
    user_usable_balance = data.usable_balance;
    user_current_balance = data.real_balance;
    res.render('dashboard/dashboard',{ layout: false,username:req.user.name,usable_balance: user_usable_balance,current_balance: user_current_balance,transaction_address : data.address });
  });
});


router.get('/signup', function(req,res,next){
	var messages = req.flash('error');
 
  /*  res.render('index', { messages: req.flash('info') });*/
	res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0 });
});


router.post('/signup',passport.authenticate('local.signup',{
		successRedirect:  '/user/signin',
		failureRedirect:   '/user/signup',
		failureFlash: true
}));



router.get('/signin',function(req,res,next){
	var messages = req.flash('error');
  var index = req.flash('info');
	res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, index: index, hasErrors: messages.length >0});
});

router.post('/signin',passport.authenticate('local.signin',{
		successRedirect:  '/user/dashboard',
		failureRedirect:   '/user/signin',
		failureFlash: true
}));

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}

module.exports = router;