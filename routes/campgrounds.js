const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas')

const validateCampground = (req,res,next) =>{
        const {error} = campgroundSchema.validate(req.body)
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg,400)
        } else{
            next();
        }
        // console.log(result)
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async (req, res,next) => {
    // try {
        // res.send(req.body)
        // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
        const campground = new Campground(req.body.campground)
        await campground.save()
        req.flash('success' , 'Successfully Made a New Campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    // } catch (e) {
    //     next(e)
    // }
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error', 'Can"t find that campground')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'Can"t find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // res.send('It worked!!')
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success' , 'SuccessFully Updated Campground!!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted campground')
    res.redirect('/campgrounds')
}))


module.exports = router