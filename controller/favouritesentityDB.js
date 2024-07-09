var express = require('express');
var app = express();
let middleware = require('./middleware.js');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './view/img/products/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.sku + '.jpg')
    }
});
var upload = multer({ storage: storage });
var furniture = require('../model/favouritesModel.js');
// app.get('/api/getFavouritesByUserId', middleware.checkToken, function (req, res) {
//     var member = req.query.member;
//     staff.getMember(member)
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).send("Failed to get member");
//         });
// });

app.get('/api/getAllFavourites/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    furniture.getAllFavourites()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get all favourites");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addFavourites', upload.single('imgfile'), function (req, res) {
    var name = req.body.name;
    var category = req.body.category;
    var description = req.body.description;
    var sku = req.body.sku;
    var length = req.body.length;
    var width = req.body.width;
    var height = req.body.height;

    var data = {
        name: name,
        category: category,
        description: description,
        sku: sku,
        length: length,
        width: width,
        height: height,
        imgPath: '/img/products/' + sku + '.jpg'
    };
    furniture.addFurniture(data)
        .then((result) => {
            if(result.success) {
                res.send(result);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add favourite");
        });
});

app.post('/api/removeFavourites', [middleware.checkToken, jsonParser], function (req, res) {
    furniture.removeFurniture(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove Furniture");
        });
});

module.exports = app;