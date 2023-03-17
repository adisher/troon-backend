const { documentsController } = require('../../controllers');

const listAllDocuments = async (filter) => {
    if (filter.name) {
        filter.name = new RegExp(filter.name, 'i');
    }
    try {
        const result = await documentsController.getAllDocuments(filter);
        return result; 
    } catch (ex) {
        return Promise.reject(ex);
    }
};

module.exports = {
    listAllDocuments
}