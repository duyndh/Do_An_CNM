var express = require('express');
var passport = require('passport');

var router = express.Router();
var User = require('../model/user');
var bodyParser = require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
var mongoose= require('mongoose');
const nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/user/signin');
});
router.get('/active/:id',function (req,res) {
    //console.log(req.params.id);

   User.findOne({_id:req.params.id},function (err,user) {
       if (err) {
            console.log(err);
            return;
        }

       var new_user = user;
       new_user.is_active = true;
       user.update(new_user, function(error){
           if (error) {
               console.log(error);
               return;
           }

           // req.flash("success_msg", "User activated successfully");
           res.render('user/signin');
        });

    });
});

router.get('/forgotpwd', function(req,res,next){
    var messages = req.flash('error');
    res.render('user/forgotpwd');
});
router.post('/forgotpwd',urlencodedParser,function (req,res) {

    var M = req.body.email;
    console.log(M);
    User.findOne({'email': M}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'User not found!'});
        }
        var p = Math.floor(Math.random() * 899999) + 100000;
        var new_user = user;
        new_user.password = new_user.encryptPassword(p);
        user.update(new_user, function (error) {
            if (error) {
                console.log(error);
                return;
            }


            var mailOptions = {
                from: 'KCoin shop <duyychiha9@gmail.com>',
                to: M, // list of receivers
                subject: 'Forgotpassword', // Subject line
                text: 'Your new-password ' + p// plain text body

            };


            email_transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    //  console.log(error);
                }
            });
            res.redirect('user/signin');
        });
    });
});


/*router.get('/user/signup', function(req,res,next){
	var messages = req.flash('error');
	res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0});
});

router.post('/user/signup',passport.authenticate('local.signup',{
		successRedirect:  '/user/profile',
		failureRedirect:   '/user/signup',
		failureFlash: true
}));

router.get('/user/profile', function(req,res,next){
	res.render('user/profile');
});

router.get('/user/signin',function(req,res,next){
	var messages = req.flash('error');
	res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0});
});

router.post('/user/signin',passport.authenticate('local.signin',{
		successRedirect:  '/user/profile',
		failureRedirect:   '/user/signin',
		failureFlash: true
}));
*/

module.exports = router;
