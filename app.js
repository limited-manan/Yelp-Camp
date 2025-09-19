// This is only for production Time
// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').config();
// }

require('dotenv').config();

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
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const helmet = require('helmet')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

const sanitizeV5 = require('./utils/mongoSanitizeV5.js');

// 'mongodb://localhost:27017/yelp-camp'
const dbUrl = process.env.DB_URL
// const dbUrl = 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database connected"))
.catch(err => console.error("Mongo connection error:", err));

// mongoose.connect(dbUrl)
// const db = mongoose.connection;
// db.on('error', console.log.bind(console, 'Connection error:'))
// db.once('open', () => {
//     console.log('DataBase Connected')
// })


const app = express();
app.set('query parser', 'extended');
app.set('trust proxy', 1);
const path = require('path');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(sanitizeV5({ replaceWith: '_' }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

store.on('error' , function(e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized : false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // will access cookies when secure version of site will be there
        // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
    }
}
app.use(session(sessionConfig))
app.use(flash());
// app.use(helmet())
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
    })
);


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dxuf2mrua/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

// app.listen(3000, (req, res) => {
//     console.log('Listening to Port 3000');
// })