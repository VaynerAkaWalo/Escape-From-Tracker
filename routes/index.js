var express = require('express');
var router = express.Router();
var loginModule = require('../modules/login')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        username: req.session.username
    })
});

router.get('/login', function(req, res, next) {
    res.render('login')
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(username != null && password != null) {
        loginModule.getUser(username, (err, result) => {
            if(result) {
                if(result.username === username && result.password === password) {
                    req.session.loggedin = true
                    req.session.username = username
                    res.redirect('/quests')
                }
                res.render('login', {
                    message: "Incorrect login or password!"
                });

            }
            else {
                res.render('login', {
                    message: "User not found!"
                });
            }
        })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

router.get('/register', function(req, res, next) {
    res.render('register')
});

router.post('/register', function(req, res, next) {
    const {username, password} = req.body;

    if(username && password) {
        loginModule.getUser(username, (err, result) => {
            if(!result) {
                loginModule.addUser(username,password, () => {
                    res.redirect('/login')
                })
            }
            else {
                res.render('register', {
                    message: "Account already exist!"
                })
            }
        })
    }
    else{
        res.render("register", {
            message: "Invalid login or password!"
        })
    }
});

module.exports = router;
