const express = require('express')
const passport = require('passport')
const app = express()

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username)
    if(username=='lisa'){
      console.log('111')
      return done(null, username, { message: 'Incorrect username.' });
    }else{
      console.log('222')
      return done(null, false, { message: 'Incorrect password.' });
    }
  }
));

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });

app.listen(3001, () => console.log('Example app listening on port 3001!'))
