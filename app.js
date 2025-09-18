if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
// const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
// const Joi = require('joi')
const {campgroundSchema , reviewSchema} = require('./schemas')
const Review = require('./models/review')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'Connection error:'))
db.once('open', () => {
    console.log('DataBase Connected')
})


const app = express();
const path = require('path');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Defining MiddleWare For Flash
app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

// Just for checking if it is working or not
// app.get('/fakeuser', async(req,res) =>{
//     const user = new User({email: 'manan@gmail.com' , username: 'manann'})
//     const newUser = await User.register(user , 'limited')
//     res.send(newUser)
// })

// These are for Routers 
app.use('/campgrounds' , campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/',userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/makecampground', async(req,res) =>{
//     const camp = new Campground({title: 'MyBackYard', description: 'cheap camping!!'})
//     await camp.save();
//     res.send(camp)
// })

// All routes shifted to routes/campgrounds

// All reviews routes shifted to routes/reviews

app.all(/(.*)/,(req,res,next) =>{
    // res.send('404!!!')
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message= 'Something went wrong'} = err
    if(!err.message) err.message = 'Oh No, Something went wrong'
    // res.status(statusCode).send(message)
    res.status(statusCode).render('error',{err})
    // res.status(statusCode).json({ error: message }) 
    // res.send('Oh Boy! Something Went Wrong!!')
})

app.listen(3000, (req, res) => {
    console.log('Listening to Port 3000');
})