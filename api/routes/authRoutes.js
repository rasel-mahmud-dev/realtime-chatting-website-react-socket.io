const passport = require('passport')
const mongoose = require('mongoose')

const User = mongoose.model('User')

module.exports = (app)=>{
  app.post("/auth/register", async(req, res, next)=>{
    const { username, email, password } = req.body
    let newUser = new User(req.body)
    newUser = await newUser.save()
    res.json({ message: 'Account Created', user:newUser })
  })

  app.post("/auth/login", async (req, res, next)=>{

    passport.authenticate("local", (err, user, info)=>{
      if(info) return console.log(info);
      if(err) return console.log(err);
      if(!user) return console.log("Something were worng ");

      req.logIn(user, (err)=>{
        if(err) return next(err)
        // res.json({message: "login Successfull", user: req.user})
        return res.redirect('/auth/current-user')
      })
    })(req, res, next)


    
  })

  app.get('/auth/current-user', (req, res, next)=>{
    res.json({currentUser: req.user})
  })
  app.get('/auth/logout', (req, res, next)=>{
    req.logout()
    res.json({message: "Log out Successfull" })
  })
}
