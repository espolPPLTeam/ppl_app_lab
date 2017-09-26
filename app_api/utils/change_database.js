const local = function() {
  if (process.env.NODE_ENV == 'production:test' || process.env.NODE_ENV == 'debug' || process.env.NODE_ENV == 'development') {
    return require('../config/main').local //local
  } else if (process.env.NODE_ENV == 'production') {
    return require('../config/main').local //local
  }
}

module.exports = {
  local,
}
