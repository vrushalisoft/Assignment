
var joi = require('joi')
const mongoose = require('mongoose');
var config = require('../config')
const User = require('./shared_modals/user.modal').UserModal

var hexa_regex = '^[0-9a-fA-F]{24}$'
var regex_id_validation = joi.string().pattern(new RegExp(hexa_regex)).required()
var optional_regex_id_validation = joi.string().pattern(new RegExp(hexa_regex)).allow(null)

module.exports.userIdBodyValidation = joi.object().keys({
  userId: joi.string().required()
})

module.exports.userIdValidation = joi.object().keys({
  _Id: joi.string().required()
})


module.exports.searchByNameValidation = joi.object().keys({
  _Term: joi.string().required()
})

module.exports.searchByEmailValidation = joi.object().keys({
  _Email: joi.string().email({minDomainSegments: 2}).required()
})

module.exports.searchPhoneValidation = joi.object().keys({
  _Phone:  joi.string().required()
})


module.exports.userValidation = joi.object().keys({
  email: joi.string().email({minDomainSegments: 2}).allow(),
  phone: joi.string().allow(), // Indian Phone
  password: joi.string().allow(),
  firstName: joi.string().default('').allow(''),
  lastName: joi.string().default('').allow(''),
  address: joi.object().keys({
    city: joi.string().default('').allow(''),
    state: joi.string().default('').allow(''),
  })
})

module.exports.registerValidation = joi.object().keys({
  email: joi.string().email({minDomainSegments: 2}).required(),
  phone: joi.string().required(), // Indian Phone
  password: joi.string().required(),
  prefix: joi.string().default(config.prefix.USER),
  firstName: joi.string().default('').allow(''),
  lastName: joi.string().default('').allow(''),
  address: joi.object().keys({
    city: joi.string().default('').allow(''),
    state: joi.string().default('').allow(''),
  })
})

module.exports.loginValidation = joi.object().keys({
  phone: joi.string().required(), // Indian Phone
  password: joi.string().required(),
})

module.exports.getAllUsers = (req, res, next) => {
  var retObj = {
      message: 'Error Getting Users',
      status: false,
      details: []
  }
  User.find({}, { password: 0 }, (err, user_data) => {
      if (err) {
          console.log(retObj.message, err)
          return res.json(retObj);
      } else {
          retObj.message = 'Found All Users'
          retObj.status = true
          retObj.details = user_data
          return res.json(retObj);
      }
  })

};

module.exports.getUserById = (req, res, next) => {
  var userId = req.params['_Id'] 
  var retObj = {
    status: false,
    message: "Err Querying database for user with id, Try again",
    details: []
  };
  User.findById(userId, {}, function(errusr, usr) {
    if (errusr) {
      res.json(retObj);
    } else {
      retObj.status = true;
      retObj.message = "user found by userId : " +userId;
      retObj.details = usr;
      res.json(retObj);
    }
  });
}

module.exports.searchUserByFirstName = (req, res, next) => {
  var term = req.params['_Term']
  var retObj = {
      message: 'Error Getting User FirstName',
      status: false,
      details: []
  }
  User.find({
      $or: [
          { firstName: { "$regex": term, "$options": "i" } }
      ]
  }, { }, (err, user) => {
      if (err) {
          console.log(retObj.message, err)
          return res.json(retObj);
      } else {
          retObj.message = 'Find User By FirstName ' +term
          retObj.status = true
          retObj.details = user
          return res.json(retObj);
      }
  })

};

module.exports.searchUserByLastName = (req, res, next) => {
  var term = req.params['_Term']
  var retObj = {
      message: 'Error Getting User LastName',
      status: false,
      details: []
  }
  User.find({
      $or: [
          { lastName: { "$regex": term, "$options": "i" } }
      ]
  }, { }, (err, user) => {
      if (err) {
          console.log(retObj.message, err)
          return res.json(retObj);
      } else {
          retObj.message = 'Find User By LastName ' +term
          retObj.status = true
          retObj.details = user
          return res.json(retObj);
      }
  })

};

module.exports.searchUserByPhone = (req, res, next) => {
  var term = req.params['_Phone']
  var retObj = {
      message: 'Error Getting User Phone',
      status: false,
      details: []
  }
  User.find({
      $or: [
          { phone: { "$regex": term, "$options": "i" } }
      ]
  }, { }, (err, user) => {
      if (err) {
          console.log(retObj.message, err)
          return res.json(retObj);
      } else {
          retObj.message = 'Find User By Phone NO ' + term
          retObj.status = true
          retObj.details = user
          return res.json(retObj);
      }
  })

}

module.exports.searchUserByEmail = (req, res, next) => {
  var term = req.params['_Email']
  var retObj = {
      message: 'Error Getting User Email',
      status: false,
      details: []
  }
  User.find({
      $or: [
          { email: { "$regex": term, "$options": "i" } }
      ]
  }, { }, (err, user) => {
      if (err) {
          console.log(retObj.message, err)
          return res.json(retObj);
      } else {
          retObj.message = 'Find User By Email ' + term
          retObj.status = true
          retObj.details = user
          return res.json(retObj);
      }
  })

}

module.exports.updateUserDetails = (req,res) => {
  var userId = req.params['_Id']
  var userDetails = req.body
  console.log('Update User Details',userDetails);
  
  var retObj = {
    status: false,
    message: "Err Updating User Details for User By Id: " + userId,
    details: []
  };

  User.updateOne({_id: userId}, userDetails).exec()
  .then(done => {
    retObj.status = true;
    retObj.message = "Successfully Updated User Details"
    retObj.details = [done]
    res.json(retObj)
  })
  .catch(err => {
    console.log('Error updating User details', err);
    res.json(retObj)
  })
}

