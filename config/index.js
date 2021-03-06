const jsonwebtoken = require('jsonwebtoken')


module.exports.roles = {
  USER : 'user'
}


module.exports.prefix = {
  USER: 'USR-'
}



module.exports.tables = {
  USER : "users"
}



module.exports.issueJWT = (tokenData) => {
  const expiresIn = '1d'
  tokenData.iat = Date.now()
  //Never Expiring Token
  const signedToken = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET);//, {expiresIn: expiresIn}
  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn
  }

}

