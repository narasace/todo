
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todo_development')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Task = new Schema({
  task: { type: String, required: true }
});

var Task = mongoose.model('Task', Task);

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'OZhCLfxlGp9TtzSXmJtq'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/tasks', function(req, res) {
  Task.find({}, function(err, docs) {
    res.render('tasks/index', {
      title: 'Todos index view',
      docs: docs
    });
  });
});

app.get('/tasks/new', function(req,res) {
  res.render('tasks/new.jade', {
    title: 'New Task'
  });
});

app.post('/tasks', function(req, res) {
  var task = new Task(req.body.task);
  task.save(function(err) {
    if (!err) {
      res.redirect('/tasks');
    } else {
      res.redirect('/tasks/new');
    }
  });
});

app.get('/tasks/:id/edit', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    res.render('tasks/edit', {
      title: 'Edit Task View',
      task: doc
    });
  });
});

app.put('/tasks/:id', function(req, res) {
  Task.findById(req.params.id, function(err, doc) {
    doc.task = req.body.task.task;
    doc.save(function(err) {
      if (!err) {
        res.redirect('/tasks');
      } else {
        console.err(err);
      }
    });
  });
});

app.del('/tasks/:id', function(req, res){
  Task.findById(req.params.id, function(err, doc){
    if (!doc) return next(new NotFound('Document not found'));
    doc.remove(function(){
      res.redirect('/tasks');
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
