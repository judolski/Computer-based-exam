const { collection } = require("./models/user");

exports.insertData = (db, collection, data) => {
    const coll = db.collection(collection);
    return coll.insertOne(data);
}

exports.findData = (db, collection) => {
    const coll = db.collection(collection);
    return coll.find({}).toArray();
}

exports.removeData = (db, collection, data) => {
    const coll = db.collection(collection);
    return coll.deleteOne(data);
}

exports.updateData = (db, collection, data, update) => {
    const coll = db.collection(collection);
    return coll.updateOne(data, {$set: update})
}