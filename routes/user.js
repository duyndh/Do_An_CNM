var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var request = require('request');
var localStorage = require('localStorage');
var bodyParser = require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
var bodyParser = require('body-parser');
var csrfProtection = csrf();
var flash = require('express-flash');


router.use(csrfProtection);

// router.get('/profile', function(req,res,next){
// 	res.render('user/profile');
// });
router.get('/logout',isLoggedIn, function(req, res,next){
  localStorage.clear();
 
  res.redirect('/user/signin');
});

router.get('/dashboard',isLoggedIn, function(req, res,next){

  var url  = 'http://localhost:8000/kcoin-api/user-dashboard';
  var data = {
    balance_address: localStorage.getItem('address')
  };
  console.log(data);
  request.post({url,form:data},function(err,httpResponse,body){
    var datas = JSON.parse(body);
    if (datas.status === 0) {
      return(false);
    }

      res.render('dashboard/dashboard',{ csrfToken: req.csrfToken(),layout: false,username:datas.data.name,usable_balance: datas.data.usable_balance,current_balance: datas.data.current_balance,transaction_address : datas.data.address});
  });

});


router.get('/signup', function(req,res,next){
	var messages = req.flash('error');
	res.render('user/signup',{csrfToken: req.csrfToken()});
});


router.post('/signup',function(req,res,next){
  var url  = 'http://localhost:8000/kcoin-api/register';
  var data = {
    email:req.body.email,
    name:req.body.name,
     password:req.body.password
  };
  request.post({url,form:data},function(err,httpResponse,body){
    var datas = JSON.parse(body);
    if (datas.status === 0) {
      res.redirect('/user/signup');
    }
    res.redirect('/user/signin');
  });
});



router.get('/signin',function(req,res,next){
	res.render('user/signin',{csrfToken: req.csrfToken()});
});

router.get('/super-dashboard',function(req,res,next){
	res.render('dashboard/admin/dashboard');
});


router.post('/signin',function(req,res,next){
  var url  = 'http://localhost:8000/kcoin-api/signin';
  var data = {
    email:req.body.email,
    password:req.body.password
  };
  request.post({url,form:data},function(err,httpResponse,body){
    var datas = JSON.parse(body);
    console.log(datas);
    if (datas.status == 0) {
      res.render('user/signin',{csrfToken: req.csrfToken()});
      return;
    }
    if (datas.is_admin ==1){
      localStorage.setItem('address', JSON.parse(body).data.address);
      res.redirect('/user/super-dashboard');
    }
    localStorage.setItem('address', JSON.parse(body).data.address);

    res.redirect('/user/dashboard');
    
  });
});

router.post('/dashboard',function(req,res,next){
  var url  = 'http://localhost:8000/kcoin-api/create-transaction';
  var data = {
    send_address:req.body.send_address,
    receive_address:req.body.receive_address,
    amount : req.body.amount
  };
  request.post({url,form:data},function(err,httpResponse,body){
    var datas = JSON.parse(body);
    console.log(datas);
    if (datas.status == 0) {
      req.session.sessionFlash = {
        type: 'danger',
        message: datas.message
    }
      res.redirect('/user/dashboard');
      return;
    }
    res.redirect('/user/dashboard');
    
  });
});

router.get('/transactions',isLoggedIn, function(req,res,next){
  
  var url  = 'http://localhost:8000/kcoin-api/gettrans';
  var data = {
  address : localStorage.getItem('address')
  };
  console.log(data);
  request.post({url,form:data},function(err,httpResponse,body){
      var datas = JSON.parse(body);
      console.log('transs:');
      console.log(datas.data.transactions);
  // if (datas.status === 0) {
  //   req.session.sessionFlash = {
  //     type: 'danger',
  //     message: datas.message
  // }
  // res.render('dashboard/confirm',{csrfToken: req.csrfToken(),layout:false});
  // }
  res.render('dashboard/confirm',{csrfToken: req.csrfToken(),layout:false,data:datas.data.transactions});
  });
});

router.get('/forgotpwd', function(req,res,next){
  
  res.render('user/forgotpwd');
});

router.get('/user-confirm/:trans_id', function(req,res,next){
  
  res.render('user/user-confirm',{trans_id:req.param.trans_id});
});

router.post('/user-confirm', function(req,res,next){
  var url  = 'http://localhost:8000/kcoin-api/confirm-transaction';
  var data = {
  password:req.body.password,
  transaction_id : req.body.transaction_id
  };
  request.post({url,form:data},function(err,httpResponse,body){
  var datas = JSON.parse(body);
  if (datas.status === 0) {
    req.session.sessionFlash = {
      type: 'danger',
      message: datas.message
    }
      res.redirect('/user/user-confirm/'+req.body.transaction_id);
  }
  res.redirect('/user/dashboard');
  });
});

router.post('/forgotpwd',urlencodedParser,function (req,res) {

  var url  = 'http://localhost:8000/kcoin-api/forgotpwd';
  var data = {
  email:req.body.email
  };
  request.post({url,form:data},function(err,httpResponse,body){
      var datas = JSON.parse(body);
  if (datas.status === 0) {
    req.session.sessionFlash = {
      type: 'danger',
      message: datas.message
  }
      res.redirect('/user/forgotpwd');
  }
  res.redirect('/user/signin');
  });
});

router.post('/confirm',function (req,res) {

  var url  = 'http://localhost:8000/kcoin-api/delete-transaction';
  var data = {
    transaction_id:req.body.transaction_id

  };
  request.post({url,form:data},function(err,httpResponse,body){
      var datas = JSON.parse(body);
  if (datas.status === 0) {
    req.session.sessionFlash = {
      type: 'danger',
      message: datas.message
  }
      res.redirect('/user/dashboard');
  }
  res.redirect('/user/confirm');
  });
});


function isLoggedIn(req, res, next){
  if(localStorage.getItem('address')){
    return next();
  }
  res.redirect('/user/signin');
}

module.exports = router;