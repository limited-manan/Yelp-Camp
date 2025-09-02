const express = require('express')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'Connection error:'))
db.once('open',() =>{
    console.log('DataBase Connected')
})


const app = express();
const path = require('path');

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))

app.get('/', (req,res) =>{
    res.render('home')
})

app.get('/makecampground', async(req,res) =>{
    const camp = new Campground({title: 'MyBackYard', description: 'cheap camping!!'})
    await camp.save();
    res.send(camp)
})

app.listen(3000, (req,res) =>{
    console.log('Listening to Port 3000');
})