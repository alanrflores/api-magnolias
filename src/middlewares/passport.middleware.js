const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { findUserById, loginUser, findUserByEmail } = require('../controllers/users');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    (email, password, done) => {
       
        findUserByEmail(email)
            .then(user => {
             console.log({user})
                if (!user)
                    return done(null, false, { message: 'Incorrect email.' });

                const isValid = bcrypt.compareSync(password, user.password);
                
                if (!isValid)
                    return done(null, false, { message: 'Incorrect password.' });
            
                return done(null, user);
            })
            .catch(err => {
                return done(null, false, err.message);
            })
    }
));

passport.serializeUser((user, done) => {
    return done(null, user._id);
});

passport.deserializeUser((id, done) => {
    findUserById(id)
    .then(user => {
        return done(null, user);
    })
    .catch(err => {
        return done(err, null)
    });
});

module.exports = passport;