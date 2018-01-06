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
router.use(csrfProtection);

// router.get('/profile', function(req,res,next){
// 	res.render('user/profile');
// });
router.get('/logout',isLoggedIn, function(req, res,next){
  localStorage.clear();
  res.redirect('/user/signin');
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
    balance_address: localStorage.getItem('address')
  };
  request.post({url,form:data},function(err,httpResponse,body){
    var datas = JSON.parse(body);
    if (datas.status === 0) {
      return(false);
    }
  res.render('dashboard/dashboard',{ layout: false,username:datas.data.name,usable_balance: datas.data.usable_balance,current_balance: datas.data.current_balance,transaction_address : datas.data.address });
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
    var datas = JSON.parse(body);
    if (datas.status === 0) {
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
  request.post({url,form:data},function(err,httpResponse,body){
    var datas = JSON.parse(body);
    if (datas.status == 0) {
      res.redirect('/user/signin');
      return;
    }
    localStorage.setItem('address', JSON.parse(body).data.address);
    res.redirect('/user/dashboard');
    
  });
});

router.post('/create-transaction',function(req,res,next){
  var url  = 'http://localhost:8000/kcoin-api/create-transaction';
  var data = {
    send_address:req.body.send_address,
    receive_address:req.body.receive_address,
    amount : req.body.amount
  };
  request.post({url,form:data},function(err,httpResponse,body){
    var datas = JSON.parse(body);
    if (datas.status == 0) {
      res.redirect('/user/dashboard');
      return;
    }
    res.redirect('/user/dashboard');
    
  });
});


router.get('/forgotpwd', function(req,res,next){
  var messages = req.flash('error');
  res.render('user/forgotpwd');
});
router.post('/forgotpwd',urlencodedParser,function (req,res) {

//     var M = req.body.email;
//    // console.log(M);
//     User.findOne({'email': M}, function (err, user) {
//         if (err) {
//             return done(err);
//         }
//         if (!user) {
//             return done(null, false, {message: 'User not found!'});
//         }
//         var p = randomstring.generate(6);
//         var new_user = user;
//         new_user.password = new_user.encryptPassword(p);
//         user.update(new_user, function (error) {
//             if (error) {
//                 console.log(error);
//                 return;
//             }


//             var mailOptions = {
//                 from: 'KCoin shop <duyychiha9@gmail.com>',
//                 to: M, // list of receivers
//                 subject: 'Forgotpassword', // Subject line
//                 text: 'Your new-password ' + p// plain text body

//             };


//             email_transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     //  console.log(error);
//                 }
//             });
//             res.redirect('user/signin');
//         });
//     });
  var url  = 'http://localhost:8000/kcoin-api/forgotpwd';
  var data = {
  email:req.body.email
  };
  request.post({url,form:data},function(err,httpResponse,body){
      var datas = JSON.parse(body);
  if (datas.status === 0) {
      res.redirect('/user/forgotpwd');
  }
  res.redirect('/user/signin');
  });
});

function isLoggedIn(req, res, next){
  if(localStorage.getItem('address')){
    return next();
  }
  res.redirect('/user/signin');
}

module.exports = router;