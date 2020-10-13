var express = require('express');
const cool = require('cool-ascii-faces');
var mongoose = require('mongoose');
var passport = require('passport');
const todoModel = require('../model/todoschema');
var todo = mongoose.model('Todo');
var router = express.Router();
var qr = require('qr-image');
const UserModel = require('../model/users');
var User = mongoose.model('UserModel')
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});
router.get('/cool', (req, res) => res.send(cool()))
router.get('/index', function (req, res) {
    var fs = include('fs');
    var newFile = fs.createWriteStream("readme_copy.md");
    var http = include('http');
    http.createServer(function (request, response) {
        request.pipe(newFile);
        request.onEvent('end', function () { });
    }).listen(8080);
});

router.get('/qr', function (req, res) {
    var svg_string = qr.imageSync("http://www.google.com", { type: 'svg', size: 10, ec_level: 'H', margin: 0 });

    res.render('qr', { qrcode: svg_string })
})

router.get('/list', function (req, res) {
    todo.find(function (err, todo) {
        if (err) {
            console.log(err);
        } else {
            res.json(todo);
        }
    });
});
router.get('/login', function (req, res) {
    res.render('login')

});
router.post('/login', function (req, res) {
    try {
        passport.authenticate('local', function (err, info) {

            User.findOne({ email: req.body.email }, function (err, user) {
                var token;
                //if Password throws/catches an error
                if (err) {
                    res.status(404).json(err)
                    return;
                }
                //if User is found
                else if (user) {
                    token = user.generateJwt();
                    res.status(200);
                    res.json({
                        'token': token
                    });
                }
                else {
                    //If user is not found  
                    res.status(401).json(info)
                }
            });
        })(req, res);
    }
    catch (err) {
        console.log(err)
    }
});

router.get('/register', function (req, res) {
    res.render('signup')
});
router.post('/register', function (req, res) {
    var user = new User();
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save(function (err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            'token': token
        });
    });
});
router.get('/profile', auth, function (req, res) {

    //If No user ID exists in JWT return 401
    if (!req.payload._id) {
        res.status(401).json({
            'message': 'Unauthorized Error: Private Profile'
        });
    } else {
        //Otherwise continue
        User.findById(req.payload._id).exec(function (err, user) {
            res.status(200).json(user);
        });
    }
});
router.post('/list', function (req, res) {
    let newtodo = new todoModel({
        name: req.body.name,
        completed: req.body.completed,
        note: req.body.note,
        latitude: req.body.latitude,
        longitude: req.body.longitude,

    });
    newtodo.save(function (err, todo) {
        if (err) {
            res.send(err);
        } {
            res.json(todo);
        }
    });
});

router.get('/list/:id', function (req, res) {
    var id = req.params.id
    todo.findById({ '_id': id }, function (err, todo) {
        if (err) {
            console.log(err)
        } else {
            res.json(todo)
        }
    });
});

router.put('/list/:id', function (req, res) {
    todo.findByIdAndUpdate(req.params.id, req.body, function (err, todo) {
        if (err) {
            console.log(err);
        } else {            
            res.json({
                'data':todo})
        }
    });
});

router.delete('/list/:id', function (req, res, next) {
    todo.remove({ _id: req.params.id }, function (err, todo) {
        if (err) return next(err);
        res.json(todo);
    });
});


module.exports = router;