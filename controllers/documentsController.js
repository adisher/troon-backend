const { documentsModel } = require('../models');

const addDocument = (body) => {

    const doc = new documentsModel(body);
    const query = { _id: doc._id };
    return documentsModel.findOneAndUpdate(query, doc, {
        upsert: true,
        new: true
    }).populate('client');
};

const updateDocument = (body) => {

    const query = { _id: body._id };
    return documentsModel.findOneAndUpdate(query, body, {
        new: true
    });
};

const deleteDocument = (filter) => {
    return documentsModel.deleteOne(filter);
};

const getDocument = (filter) => {
    return documentsModel.findOne(filter);
};

const getAllDocuments = (filter) => {
    return documentsModel.find(filter).populate('client');
};

module.exports = {
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    getAllDocuments,

};
