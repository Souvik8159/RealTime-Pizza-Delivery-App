require("dotenv").config();
const express=require("express");
const app=express();
const ejs=require("ejs");
const path=require("path");
const expressLayout=require("express-ejs-layouts");
const PORT=process.env.PORT || 3000;
const mongoose=require("mongoose");
const session=require("express-session");
const flash=require("express-flash");
const MongoDbStore=require("connect-mongo");
const passport=require('passport')
const Emitter=require("events")

//Database Connection
mongoose.connect("mongodb+srv://souvik:Souvik8918@cluster0.hypqczx.mongodb.net/PizzaApp").then((data)=>{
    console.log("Database connected");
})

//EventEmitter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter)

//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store: MongoDbStore.create({
        mongoUrl: 'mongodb+srv://souvik:Souvik8918@cluster0.hypqczx.mongodb.net/PizzaApp'
      }),
    cookie:{maxAge:1000*60*60*12}
}))

//passport config
const passportInit=require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());

//Assests
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()
})
//set template engine
app.use(expressLayout);
app.set("views",path.join(__dirname,"/resources/views"));
app.set("view engine","ejs");


require("./routes/web")(app)



const server=app.listen(PORT,(err)=>{
    if(err){
        console.log("Err");
    }else{
        console.log(`Server Started on ${PORT}`);
    }
})


//Socket

const io = require('socket.io')(server)
// app.set('io', io);
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})