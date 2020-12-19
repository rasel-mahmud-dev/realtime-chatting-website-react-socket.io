const LocalStrategy  = require('passport-local').Strategy
const passport  = require('passport')
const mongoose = require('mongoose')

const User = mongoose.model('User')


passport.use(
  new LocalStrategy(
    { usernameField: 'email'},
    async (email, password, done)=>{      
      const user = await User.findOne({email})      
      if(!user) return done(null, false, { message: 'Not Registed this Email' })
      let matchedPass = password == user.password
      if(!matchedPass) return done(null, false, { message: "worng password..." })
      done(null, user._id)
    }
  )
)

// set userID inside req.session 
passport.serializeUser((userId, done)=>{
  done(null, userId)
})

// set user inside req obj
passport.deserializeUser((userId, done)=>{
  User.findById(userId, (err, user)=>{    
    done(null, user)
  })
})