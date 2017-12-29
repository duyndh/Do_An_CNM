var express = require('express');
var router = express.Router();
var User = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/user/signin');
});
router.get('/active/:id',function (req,res) {
    console.log(req.params.id);
   /* User.findById({_id:req.params.id},function (err,user) {
        if (err) {
            console.log(err);
            return;
        }
       // console.log(_id);
        var new_user = user;
        new_user.is_active = true;
        user.update(new_user, function(error){
            if (error) {
                console.log(error);
                return;
            }

            req.flash("success_msg", "User activated successfully");
            res.redirect('/user/signup');
        });

    });*/
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
