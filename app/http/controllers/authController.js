const passport = require("passport")
const User=require("../../models/user")
const bcrypt=require("bcrypt")
function authController(){

    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin-orders' : '/'
    }

    return{
        login(req,res){
            res.render("auth/login")
        },
        postLogin(req,res,next){

            const {email,password}=req.body;
            //validate request
            if(!email || !password){
                req.flash('err','All field required');
                return res.redirect("/login");
            }

            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('err',info.messages);
                    return next(err);
                }
                if(!user){
                    req.flash('err',info.messages);
                    return res.redirect('/login');
                }

                req.logIn(user,(err)=>{
                    if(err){
                        req.flash('err',info.messages);
                        return next(err);
                    }
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req,res,next)
        },
        register(req,res){
            res.render("auth/register")
        },
        async postRegister(req,res){
            const {name,email,password}=req.body;
            //validate request
            if(!name || !email || !password){
                req.flash('error','All field required');
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect("/register");
            }
            // check if email exist
            // User.exists({email:email},(err,result)=>{
            //     if(result){
            //         req.flash('error','Email already taken');
            //         req.flash('name',name)
            //         req.flash('email',email)
            //         return res.redirect("/register");
            //     }
            // })

            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                req.flash('error', 'Email already taken');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect("/register");
            }


            //Hash password
            const hashedPassword=await bcrypt.hash(password,10)
            //create a user
            const user=new User({
                name,
                email,
                password:hashedPassword
            })

            user.save().then((user)=>{
                //Login
                return res.redirect("/login")
            }).catch(err=>{
                req.flash('error','Something went wrong');
                return res.redirect("/register");
            })

        },
        logout(req,res){
            req.logout(req.user, err => {
                if(err) return next(err);
                res.redirect("/login");
              });
              // req.logout()
            // return res.redirect("/login");

        }
    }
}

module.exports=authController;