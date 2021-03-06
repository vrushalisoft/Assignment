
const config = require('../config')
const joi = require('joi')
const UserModal = require('./shared_modals/user.modal').UserModal

var hexa_regex = '^[0-9a-fA-F]{24}$'
var regex_id_validation = joi.string().pattern(new RegExp(hexa_regex)).required()



module.exports.userIdValidation = joi.object().keys({
  userId: regex_id_validation
}) 

module.exports.phoneBodyValidation = joi.object().keys({
  phone: joi.string().required(),
})

// SSO

module.exports.login = async (req, res) => {
  var retObj = {
    message: 'User Not Found',
    status: false,
    details: []
  }
  try{
    var user = await UserModal.findOne({phone: req.body.phone})
    if(!user) {
      return res.json(retObj);
    } else {
      if (!user.validatePassword(req.body.password)) {
        retObj.message = 'Phone Number Or Password Invalid'
        return res.json(retObj)
      } else {
        console.log('User Found');
        var _token = user.generateLoginToken()
        var _user_data = user.getUserData()
        retObj.message = 'Logged In Successfully'
        retObj.status = true
        retObj.details = _user_data
        retObj.jwt_token = _token.token
        retObj.expires = _token.expires
        res.json(retObj);
      }
    }
  } catch(err) {
    console.log('Error while logging in ', err);
    res.json(retObj)
  }
}

module.exports.register = async (req, res) => {
  var retObj = {
    message: 'User Already Exists',
    status: false,
    details: []
  }
  try {
    var user = await UserModal.findOne({phone: req.body.phone})
    if(!user) {
      var user_data = req.body;
      req.body.role = ['user']
      var userCount = await UserModal.countDocuments();
      console.log('User Count', userCount);
      user_data.userId = userCount + 1
      user_data.prefix = config.prefix.USER
      var newUser = new UserModal(user_data)
      var saved = await newUser.save()
      retObj.message = "User Registered Successfully"
      retObj.details = saved
      retObj.status = true
      res.json(retObj)
    } else {
      return res.json(retObj);
    }
  } catch(err) {
    console.log('error creating  user', err);
    retObj.message = "Error Registering User"
    retObj.details = []
    res.json(retObj)
  }
}






