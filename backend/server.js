var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'backoffice'
});


app.get('/api/menu', function (req, res, next) {
  const page = parseInt(req.query.page)
  const per_page = parseInt(req.query.per_page)
  const sort_column = req.query.sort_column
  const sort_direction = req.query.sort_direction
  const startIndex = (page - 1) * per_page
  const search = req.query.search
  let params = []
  let sql = 'SELECT * FROM food'
  if (search) {
    sql += ' Where food_name LIKE ?'
    params.push('%' + search + '%')
  }
  if (sort_column) {
    sql += ' ORDER BY ' + sort_column + ' ' + sort_direction
  }
  sql += ' LIMIT ?, ?'
  params.push(startIndex)
  params.push(per_page)

  // execute will internally call prepare and query
  connection.execute(sql, params,
    function (err, results, fields) {
      console.log(results);
      connection.query(
        'SELECT COUNT(id) as total FROM food',
        function(err, counts, fields) {
          const total = counts[0]['total']
          const total_pages = Math.ceil(total/per_page)
          res.json({
            total: total,
            total_pages: total_pages,
            page: page,
            per_page: per_page,
            data: results
          })
        }
      );
    }
  );
})

app.post('/api/food', (req, res) => {
  connection.query(
    'INSERT INTO `food` (`food_name`, `price`, `description`) VALUES (?, ?, ?)',
    [req.body.food_name, req.body.price, req.body.description],
    function (err, results) {
      res.json(results)
    }
  )
})

app.put('/api/food', (req, res) => {
  connection.query(
    'UPDATE `food` SET `food_name` = ?, `price` = ?, `description` = ? WHERE id = ?',
    [req.body.food_name, req.body.price, req.body.description, req.body.id],
    function (err, results) {
      res.json(results)
    }
  )
})

app.delete('/api/food', (req, res) => {
  connection.query(
    'DELETE FROM `food` WHERE id = ?',
    [req.body.id],
    function (err, results) {
      res.json(results)
    }
  )
})

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})