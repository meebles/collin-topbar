const Router = require('express-promise-router');
const db = require('../postgres');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application
module.exports = router;
router.get('/:id', (req, res) => {
  const { id } = req.params
  console.log(db);
  const rows = db.query('SELECT * FROM products WHERE id = $1', [id])
  res.send(rows[0])
})