const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order-model');
const Cart = require('../models/cart-model');
const User = require('../models/user-model');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);    // accept a file
    } else {
        cb(null, false);    // reject a file
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', checkAuth, (req, res) => {
    Order.find({user: req.userData})
    .then(orders => {
        let cart;
        orders.forEach(order => {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });

        User.findById(req.userData._id).then(user => {
            if (!user) {
                return res.send({ success: false, message: 'User does not exist'});
            } else {
                result = {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    _id: user._id
                }
                return res.send({user: result, success: true, orders: orders});
            }
        }).catch(err => {
            console.log(err);
            return res.send({ success: false, message: err });
        });

        // res.send({user: req.userData, success: true, orders: orders});
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// update profile details of an existing user
router.put('/update-profile/:id', checkAuth, (req, res, next) => {
    let userId = req.params.id;
    
    User.findByIdAndUpdate({_id: userId}, req.body, { new: true }).then(user => {
        if (!user) {
            return res.send({ success: false, message: 'User does not exist'});
        } else {
            result = {
                name: user.name,
                email: user.email,
                image: user.image,
                _id: user._id
            }
            return res.send({ success: true, message: 'User details updated', user: result });
        }
    }).catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// update profile image of an existing user
router.put('/update-profile-image/:id', checkAuth, upload.single('userImage'), (req, res, next) => {
    let userId = req.params.id;
    
    User.findByIdAndUpdate({_id: userId}, {image: req.file.originalname}, { new: true }).then(user => {
        if (!user) {
            return res.send({ success: false, message: 'User does not exist'});
        } else {
            result = {
                name: user.name,
                email: user.email,
                image: user.image,
                _id: user._id
            }
            return res.send({ success: true, message: 'User image updated', user: result });
        }
    }).catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

module.exports = router;