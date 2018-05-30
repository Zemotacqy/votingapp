let pollmodel = require('./../app/models/poll.js');
let usermodel = require('./../app/models/user.js');

module.exports = (req, res)=>{
	//console.log(req.body);
	//console.log(req.user);
	usermodel.findOne({
		username : req.user.username
	}, (err, user)=>{

		if(err){
			console.log(err);
			req.flash('createpollMessage', "Some Error Occured!!!!")
			res.redirect('/user/createpoll');
		}else{
			// user doesn't exists
			if(!user){
				req.flash('loginMessage', "Login First!");
				res.redirect('/login');
			}else if(user){	// user exists

				// create an array of options
				let optionsArray = [], reqObject = req.body;
				for( let prop in reqObject ){
					if( reqObject.hasOwnProperty(prop) ){
						if( prop.toString().trim() != "question" ){
							const optionObj = {
								option : reqObject[prop],
								votes : 0
							};
							optionsArray.push(optionObj);
						}
					}
				}

				// make a newpoll
				let newpoll = new pollmodel({
					question : req.body.question,
					owner : user._id,
					options : optionsArray,
					createdat : new Date()
				});

				newpoll.save().then((doc)=>{
					//console.log(doc);
					user.mypolls.push(newpoll.id);
					user.save((err)=>{
						if(err){
							console.log(err);
							req.flash('createpollMessage', "Some error Occured");
							res.redirect('/user/createpoll');
						}else{
							usermodel.find({})
								.populate('mypolls')
								.exec(function(err, users) {
							        if(err){
										console.log(err);
										req.flash('createpollMessage', "Some Error Occured!!!!")
										res.redirect('/user/createpoll');
									}else{
										//console.log(users);
										req.flash('createdpollMessage', "Poll created successfully, visit: I am Awesome.com");
										res.redirect('/user/createpoll');
									}
							});
						}
					});
				}).catch((err)=>{
					console.log(err);
					req.flash('createpollMessage', "The Poll cannot be saved. Please Try Again.");
					res.redirect('/user/createpoll');
				});
			}
		}
	}).catch((err)=>{
		console.log(err);
		req.flash('createpollMessage', "Some Error Occured!!!");
		res.redirect('/user/createpoll');
	});
};