const express = require('express')
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware');

const multer  = require('multer')
const { storage } = require('../cloudinary') 
const upload = multer({ storage })

// const campground = require('../models/campground');
// const ExpressError = require('../utils/ExpressError')


// Moving middleware from here to Middleware file

// other way is through router.route it chains all the same routes values

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn ,upload.array('image') , validateCampground, catchAsync(campgrounds.createCampgrounds))
    
    // For testing purpose only
    // .post(upload.array('image'),(req,res) =>{
    //     console.log(req.body , req.files);
    //     res.send('IT WORKED??')
    // })

router.get('/new', isLoggedIn , campgrounds.renderNewForm)    

router.route('/:id')
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn , isAuthor , upload.array('image') , validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn , isAuthor ,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn , isAuthor , catchAsync(campgrounds.renderEditForm))


// Previously it looks like (before chaining)
// router.get('/', catchAsync(campgrounds.index))
// router.post('/', isLoggedIn ,validateCampground, catchAsync(campgrounds.createCampgrounds))
// router.get('/:id', catchAsync(campgrounds.showCampgrounds))
// router.put('/:id',isLoggedIn , isAuthor , validateCampground, catchAsync(campgrounds.updateCampground))
// router.delete('/:id', isLoggedIn , isAuthor ,catchAsync(campgrounds.deleteCampground))


module.exports = router