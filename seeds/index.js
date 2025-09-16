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
        const price = Math.floor(Math.random() * 20) +10
        const camp = new Campground({
            author: '68c7dc2032d237a5b6ad3e4b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://picsum.photos/400?random=${Math.random()}',
            description: 'This is just a random text for the campground and it has no relation with our data this is just to test our site',
            price
        })
        await camp.save();
    }

}

seedDB().then(() =>{
    mongoose.connection.close();
})