var db = require('./databaseConfig.js');
var Favourite = require('./favourites.js');
var favouritesDB = {
    
    getAllFavourites: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM favouritesentity WHERE member = ?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            var favList = [];
                            for(var i = 0; i < result.length; i++) {
                                var fav = new Favourite();
                                fav.id = result[i].id;
                                fav.name = result[i].name;
                                fav.imageURL = result[i].imageURL;
                                fav.sku = result[i].sku;
                                fav.description = result[i].description;
                                fav.type = result[i].type;
                                fav.length = result[i].length;
                                fav.width = result[i].width;
                                fav.height = result[i].height;
                                fav.category = result[i].category;
                                favList.push(fav);
                            }
                            conn.end();
                            return resolve(favList);
                        }
                    });
                }
            });
        });
    },
    addFavourites: function (data) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var name = data.name;
                    var category = data.category;
                    var description = data.description;
                    var sku = data.sku;
                    var length = data.length;
                    var width = data.width;
                    var height = data.height;
                    var volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
                    var sqlArgs = ["FurnitureEntity",sku,length,category,description,height,name,"Furniture",volume,width];
                    var sql = 'INSERT INTO favouritentity(DTYPE,SKU,_LENGTH,CATEGORY,DESCRIPTION,HEIGHT,NAME,TYPE,VOLUME,WIDTH)'
                        + 'values(?,?,?,?,?,?,?,?,?,?)';
                    conn.query(sql, sqlArgs, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } else {
                            if(result.affectedRows > 0) {
                                favouritesDB.addFurniture2(result.insertId, data.imgPath)
                                    .then((result) => {
                                        conn.end();
                                        return resolve({success: result, sku: sku});
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        conn.end();
                                        return reject(err);
                                    });
                            }
                        }
                    });
                }
            });
        });
    },
    removeFurniture: function (ids) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    conn.end();
                    return reject(err);
                }
                else {
                    var idString = '';
                    for(i = 0; i < ids.length; i++) {
                        idString += ids[i] + ',';
                    }
                    idString = idString.substr(0, idString.length - 1);
                    var sql = 'DELETE FROM favouriteentity WHERE ID IN (' + idString + ')';
                    conn.query(sql, function (err, result) {
                        if (err) {
                            conn.end();
                            return reject(err);
                        } 
                        else {
                            var sql = 'DELETE FROM itementity WHERE ID IN (' + idString + ')';
                            conn.query(sql, function (err, result) {
                                if (err) {
                                    conn.end();
                                    return reject(err);
                                } 
                                else {
                                    if(result.affectedRows > 0) {
                                        conn.end();
                                        return resolve(true);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    
};
module.exports = favouritesDB