🏕️ YelpCamp

YelpCamp is a full-stack web application that allows users to discover, create, and review campgrounds. Built with Node.js, Express, MongoDB, and EJS, 
it demonstrates modern web development practices including authentication, CRUD operations, and API integration.

🚀 Live Demo

Access the live application here:
YelpCamp Live Demo: https://yelpcamp-y3bl.onrender.com

🧱 Features

User Authentication: Sign-up, login, and logout using Passport.js.
CRUD Functionality: Create, read, update, and delete campgrounds and reviews.
Image Upload: Upload images using Cloudinary.
Interactive Maps: View campground locations with Mapbox.
Responsive Design: Works well on mobile and desktop devices.
Persistent Data: MongoDB for storing campgrounds, users, and reviews.

🛠️ Technology Stack

Frontend: HTML, CSS, Bootstrap 4, EJS
Backend: Node.js, Express.js, MongoDB, Mongoose, Passport.js
APIs/Services: Cloudinary (image hosting), MapTiler (maps & geolocation)

📦 Installation

Clone the repository

git clone https://github.com/limited-manan/Yelp-Camp.git
cd Yelp-Camp


Install dependencies
npm install


Set up environment variables

Create a .env file in the root directory and add:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongodb_connection_string
SECRET=your_session_secret


Run the application
npm start


Visit http://localhost:3000 to see it in action.

🧪 Usage

Browse campgrounds on the homepage.
Create new campgrounds (login required).
Leave reviews and ratings on campgrounds.
Edit or delete your own campgrounds and reviews.

🤝 Contributing

Fork the repository
Create a branch: git checkout -b feature-name
Commit changes: git commit -am 'Add feature'
Push to branch: git push origin feature-name
Open a Pull Request

📄 License

This project is licensed under the MIT License – see the LICENSE
 file in the repository for details.
