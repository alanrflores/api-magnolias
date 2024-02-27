const server = require('express').Router();

server.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to your profile');
    } else {
        res.redirect('/login');
    }
})

server.get('/failure', (req, res) => {
    const failureMessage = req.flash('error')[0]; // Obtiene el mensaje flash de error
    res.status(401).json({ message: failureMessage || 'Authentication failed' });
});


server.get('/current_user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
 });
 
module.exports = server;