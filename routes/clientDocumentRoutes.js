const express = require('express');
const router = express.Router();
const clientDocumentsBean = require('../beans/client/clientDocumentsBean');
/* GET users listing. */ // Our first REST API

router.get('/', async function(req, res, next) {
  const query = req.query;
  const item = req.user.userType.item;
  query.client = item;
  try {
    const result = await clientDocumentsBean.getClientAllDocuments(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/',  async function(req, res, next) {
  const item = req.user.userType.item;
  const body = req.body;
  body.client = item;
  try {
    const result = await clientDocumentsBean.addClientDocument(body);
    res.status(200).send(result);
  } catch (error) { 
    res.status(500).send(error);
  }
});

router.put('/', async function(req, res, next) {
  const body = req.body;
  if(!body._id){
    return res.status(400).send({messege : "_id is required"});
  }
  try {
    const result = await clientDocumentsBean.updateDocument(body);
    res.status(200).send(result);
  } catch (error) { 
    res.status(500).send(error);
  }
});

router.delete('/:id' , async function(req,res,next){
  const id = req.params.id
  try{
    const filter = {_id : id}  //filters and find where id = to this and then delete
    const result = await clientDocumentsBean.deleteDocument(filter);
    res.status(200).send("Document Deleted Successfully" ); 

  } catch (error) {
    res.status(500).send(error);

  }


});

module.exports = router;
