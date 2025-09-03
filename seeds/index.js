const mongoose = require('mongoose')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'Connection error:'))
db.once('open',() =>{
    console.log('DataBase Connected')
})

const sample = (array) => array[Math.floor(Math.random()* array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});
    // const c = new Campground({title: 'Purple Fiels'})
    // await c.save();    
    for(let i = 0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }

}

seedDB().then(() =>{
    mongoose.connection.close();
})