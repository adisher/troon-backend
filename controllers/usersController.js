const { userModel } = require("../models");

const addUser = (body) => {
  //function/query stored in variable 'addUser'
  const doc = new userModel(body);
  const query = { _id: doc._id }; //same as 'where' in sql
  return userModel
    .findOneAndUpdate(query, doc, {
      upsert: true, //upsert is used to add new objects/records in DB
      new: true,
    })
    .populate("userType.item"); //always returns the latest/new record in BD
};
const updateUser = (body) => {
  //function/query stored in variable 'addUser'
  const doc = new userModel(body);
  const query = { _id: body._id }; //same as 'where' in sql
  return userModel.findOneAndUpdate(query, doc, {
    // filters using Id and update
    new: true,
  }); //always returns the latest/new record in BD
};

const deleteUser = (filter) => {
  return userModel.deleteOne(filter);
};

const getUser = (filter) => {
  return userModel.findOne(filter).populate("userType.item");
};

const getAllUsers = (filter) => {
  return userModel.find(filter).populate("userType.item");
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
};
