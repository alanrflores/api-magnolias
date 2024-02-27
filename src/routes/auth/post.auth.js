 const passport = require('passport');
 const server = require('express').Router();
 const { loginUser, findUserByEmail } = require("../../controllers/users");
 const bcrypt = require('bcrypt');
// server.post('/login', 

//   passport.authenticate('local', { 
//     successRedirect: '/v1/auth/profile',
//     failureRedirect: '/v1/auth/failure',
//     failureFlash: true
//   })
// )
  
// module.exports = server;

// const passport = require('passport');
// const { loginUser } = require('../../controllers/users');


// server.post('/login', async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const user = await loginUser(email, password);

//     req.logIn(user, (err) => {
//       if (err) {
//         return next(err);
//       }

//       return res.redirect('/v1/auth/profile');
//     });
//   } catch (error) {
//     // Puedes manejar el error según tus necesidades
//     console.error('Error during login:', error.message);
//     return res.redirect('/v1/auth/failure');
//   }
// });

server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
  
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }
    
    const isValid = bcrypt.compareSync(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Password does not match",
      });
    }

   
     
    return res.status(200).json({
      success: true,
      data: user,
      
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err.message,
    });
  }
});


 module.exports = server;
