

module.exports = function(app, passport){

	// check if a user is signed in or not
	function isAuth(req, res, next){
		if(req.user)
    		return next();
    	else
    		res.redirect('/login');
	};

	// handle the home page
	app.get('/', (req, res)=>{
		res.render('index.ejs', { message : req.flash('info') });
	});

	// handle the login page
	app.get('/login', (req, res)=>{
		res.render('login.ejs', { message : req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('login', { 
			successRedirect: '/user',
		    failureRedirect: '/login',
		    failureFlash: true 
		})
	);

	// handle the Signup page
	app.get('/signup', (req, res)=>{
		res.render('signup.ejs', { failureMessage : req.flash('failureMessage') });
	});

	app.post('/signup', (req, res)=>{
		console.log(req.query);
		require('./../config/saveuser.js')(req, res);
	});


	/* From now on, use the following format for routing:
	*  app.<method>('<url', isAuth, (req, res){
	*    res.render('<ejsfile>', {user : req.user, <other object data>})
	*  });
	*  here isauth is neccessary to check if a user is 
	*  logged in or not.
	*  Don't use the isAuth middleware when user 
	*  authentication is not required.
	*/

	// handle the logout procedure
	app.get('/user/logout', isAuth, (req, res)=>{
		req.flash('info', "Successfully logged out.");
		req.logout();
		res.redirect('/');
	});

	// handle the user profile page
	app.get('/user', isAuth, (req, res)=>{
		res.render('userview.ejs', { user : req.user, message : req.flash('profileMessage') });
	});

	// handle the createpoll page	
	app.get('/user/createpoll', isAuth, (req, res)=>{
		res.render('createpoll.ejs', { user : req.user, message : req.flash('createpollMessage'), createdMessage : req.flash('createdpollMessage') });
	});

	app.post('/user/createpoll', isAuth, (req, res)=>{
		require('./../config/createpoll.js')(req, res);
	});

};