var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var request = require('request');

var csrfProtection = csrf();
router.use(csrfProtection);

// router.get('/profile', function(req,res,next){
// 	res.render('user/profile');
// });
router.get('/logout',isLoggedIn, function(req, res,next){
  req.logout();
  res.redirect('/');
});

router.get('/dashboard',isLoggedIn, function(req, res,next){
  // var id = req.user.transaction_id;
  // var user_usable_balance = 0;
  // var user_current_balance = 0;
  // var transaction = Transaction.findById(req.user.transaction_id,function(err,data){
  //   user_usable_balance = data.usable_balance;
  //   user_current_balance = data.real_balance;
  //   res.render('dashboard/dashboard',{ layout: false,username:req.user.name,usable_balance: user_usable_balance,current_balance: user_current_balance,transaction_address : data.address });
  // });
  var url  = 'http://localhost:8000/kcoin-api/user-dashboard';
  var data = {
    balance_id: req.user.balance_id
  };
  request.post({url,form:data},function(err,httpResponse,body){
    if (response.status === 0) {
      return(false);
    }
  res.render('dashboard/dashboard',{ layout: false,username:req.user.name,usable_balance: data.usable_balance,current_balance: data.current_balance,transaction_address : data.address });
  });

});


router.get('/signup', function(req,res,next){
	var messages = req.flash('error');
	res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0 });
});


router.post('/signup',function(req,res,next){
  var url  = 'http://localhost:8000/kcoin-api/register';
  var data = {
    email:req.body.email,
    name:req.body.name,
     password:req.body.password
  };
  request.post({url,form:data},function(err,httpResponse,body){
    //console.log(body);
    console.log(httpResponse);
    if (body.status === 0) {
      res.redirect('/user/signup');
    }
    res.redirect('/user/signin');
  });
});



router.get('/signin',function(req,res,next){
	var messages = req.flash('error');
  var index = req.flash('info');
	res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, index: index, hasErrors: messages.length >0});
});

router.post('/signin',function(req,res,next){
  var url  = 'http://localhost:8000/kcoin-api/signin';
  var data = {
    email:req.body.email,
    password:req.body.password
  };
  $.post(url, data, function (response) {
      if (response.status === 0) {
        res.redirect('user/signin');
      }

      res.redirect('/dashboard');
  }, 'json');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}

module.exports = router;