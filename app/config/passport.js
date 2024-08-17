const LocalStrategy=require("passport-local").Strategy
const User=require("../models/user")
const bcrypt=require("bcrypt")

function init(passport){
    passport.use(new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
        //login
        //check if email exist
       const user = await User.findOne({email:email})
       if(!user){
        return done(null,false,{messages:"No user found"});
       }

       bcrypt.compare(password,user.password).then(match=>{
           if(match){
               return done(null,user,{messages:"Logged in Successfully"})
            }else{
            return done(null,false,{messages:"Invalid username or password"})
            }
       }).catch(err=>{
            return done(null,false,{messages:"Something went wrong"})
       })

    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })

    // passport.deserializeUser((id,done)=>{
    //     User.findById(id,(err,user)=>{
    //         done(err,user)
    //     })
    // })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
    
}

module.exports=init