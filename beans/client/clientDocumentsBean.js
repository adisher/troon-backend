const {documentsController,emailController} = require('../../controllers');

const addClientDocument = async (body) => {
  try {
    const result = await documentsController.addDocument(body);
    // const mailOption = { to: result.client.email, Subject: 'Account Activation', html: '' };
    const info = await emailController.sendEmail();
    return { result, msgUrl: info };
  } catch (error) {
    return Promise.reject(error);
  }
};
 const updateClientDocument =async (body) => {
  try {
      const result = await documentsController.updateDocument(body);
      return result;
  }catch(error){

    return Promise.reject(error)
  }
 }

 const deleteClientDocument = (filter) => {
     return documentsController.deleteDocument(filter);
 }

 const getClientDocument = (filter) =>{
  return documentsController.getDocument(filter);
 }

 const getClientAllDocuments = (filter) =>{
  return documentsController.getAllDocuments(filter);
 }

module.exports = {addClientDocument,updateClientDocument,deleteClientDocument,getClientDocument,getClientAllDocuments};