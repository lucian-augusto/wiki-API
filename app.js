//jshint esversion:6

// Requiring Modules
const bodyParser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const mongoose = require('mongoose');

// Initialising the 'app' with express
const app = express();

// Setting EJS body-parser and public folder
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

// Setting up MongoBD/mongoose connection
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Creating Schemas
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Creating Models
const Article = new mongoose.model('Article', articleSchema);

// Setting up the chained '/articles' route
app.route('/articles')

  // Creating 'get' route that fetches all the articles
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  // Setting up post request for the '/article' route
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send('Successfully added a new article.');
      } else {
        res.send(err);
      }
    });
  })

  // Creating the 'delete' request for all the articles
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send('Successfully deleted all articles.');
      } else {
        res.send(err);
      }
    });
  });

// Setting up the specific article route
app.route('/articles/:articleTitle')

  // Setting up the get request
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send('Article not found');
      }
    });

  })

  // Setting up the 'put' request
  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send('Successfully updated article.');
        } else {
          res.send(err);
        }
      }
    );
  })

  // Setting up the 'patch' request
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send('Successfully updated article.');
        } else {
          res.send(err);
        }
      }
    );
  })

  // Setting up the 'delete' request
  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send('Successfully deleted the article');
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function() {
  console.log('Server started on port 3000.');
});
