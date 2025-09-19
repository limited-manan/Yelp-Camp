const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'Connection error:'))
db.once('open', () => {
    console.log('DataBase Connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({title: 'Purple Fiels'})
    // await c.save();    
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            // USER ID
            author: '68c7dc2032d237a5b6ad3e4b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'This is just a random text for the campground and it has no relation with our data this is just to test our site',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dxuf2mrua/image/upload/v1758118151/YelpCamp/rlxnpkvxcovpp6kx1fwj.jpg',
                    filename: 'YelpCamp/rlxnpkvxcovpp6kx1fwj',
                    // _id: new ObjectId('68cac10bef2ae93a42578182')
                },
                {
                    url: 'https://res.cloudinary.com/dxuf2mrua/image/upload/v1758118155/YelpCamp/r9qipzfhbfkztglajtkx.jpg',
                    filename: 'YelpCamp/r9qipzfhbfkztglajtkx',
                    // _id: new ObjectId('68cac10bef2ae93a42578183')
                }
            ]
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})