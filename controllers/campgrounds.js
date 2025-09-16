const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampgrounds = async (req, res,next) => {
    // try {
        // res.send(req.body)
        // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
        const campground = new Campground(req.body.campground)
        campground.author = req.user._id;
        await campground.save()
        req.flash('success' , 'Successfully Made a New Campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    // } catch (e) {
    //     next(e)
    // }
}

module.exports.showCampgrounds = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'Can"t find that campground')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Can"t find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // res.send('It worked!!')
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success' , 'SuccessFully Updated Campground!!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted campground')
    res.redirect('/campgrounds')
}