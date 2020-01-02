const test = require('./test').default
const handskar = require('./handskar')
module.exports = app => {
  app.use('/pgtest', test)
  app.use('/handskar', handskar)
}