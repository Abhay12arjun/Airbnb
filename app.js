import mongoose from "mongoose";
import express from "express";



import methodOverride from "method-override";
import ejsMate from "ejs-mate"
const PORT=8080
import Listing from "./models/listing.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash"
import passport from "passport";
import LocalStrategy from "passport-local"
import isLoggedIn from "./middleware/authmiddleware.js";

import path from "path";
import { fileURLToPath } from "url";
import WrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import listingSchema  from "./schema.js";
import User from "./models/user.js"
import bodyParser from "body-parser";
import bcrypt from "bcryptjs"
import isReviewAuthor from "./middleware/AuthorReview.js"
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");



// import upload from "./middleware/upload.js";
// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
import dotenv from "dotenv";
dotenv.config();


import multer from "multer";
import { storage } from "./cloudinary.js";
const upload = multer({storage})



app.set('view engine', 'ejs');
app.set('./views',"./views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use(express.urlencoded({ extended: true }));  //This is middleware to parse the incoming request body
app.use(methodOverride('_method')); // This is middleware to override HTTP methods
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public'))); //this is middleware to serve static files from the 'public' directory
//Authentication 



// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



import sampleListings from "./database/db.js";
import { stat } from "fs";
import Reviews from "./models/Review.js";
const MONGO_URI="mongodb+srv://krabhaycse2024:Abhaykr563563@cluster0.rn0pi3o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Created")
}


const seedDatabase = async () => {
  try {

    await Listing.deleteMany();
    console.log("Old data cleared");
    const listingsWithOwner=sampleListings.map((obj)=>({ ...obj,owner:"68a34d81e28a2a9e0099e628"}))
    const insertedListings = await Listing.insertMany(listingsWithOwner);
    console.log(`Inserted ${insertedListings.length} listings`);
    
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

// seedDatabase();

app.use(
  session({
    secret: "mysecretsecret", // change in production
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Serialize & Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// app.use(session(session));
app.use(flash());

//Authentication way

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});




// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password,username } = req.body;


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send("⚠️ User already exists! Please <a href='/login'>Login</a>");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword ,username});
  await newUser.save();

  res.send("✅ Signup successful! <a href='/login'>Login here</a>");
});

app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("⚠️ User not found! <a href='/'>Signup</a>");
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("❌ Invalid password!");
    }

    // 3. Login user and create session
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/allistinggg");
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal Server Error");
  }
});
//Logout...
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success","You logged Out Successfully")
    res.redirect("allistinggg"); // redirect to homepage after logout
  });
});
//Home page Routes
app.get(("/"),(req,res)=>{
  res.redirect("/allistinggg")
})

app.get("/allisting",async(req,res)=>{
   const allistings=await Listing.find({});
   res.render("index.ejs", { allistings });
})
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.succes = req.flash("succes");
  res.locals.error = req.flash("error");
  res.locals.edit=req.flash("edit")
  res.locals.revdel=req.flash("revdel")
  res.locals.currUser=req.user;

  
  next();
})

app.get("/allistinggg",async(req,res)=>{
   const allistings=await Listing.find({});
   res.render("additinal.ejs", { allistings });
})


app.get("/listings/new",(req,res)=>{
  // console.log(req.user)
  if(!req.isAuthenticated()){
    return res.redirect("/login");
  }
  res.render("new.ejs");
})

app.use((req,res,next)=>{
  res.locals.review=req.flash("review");
  next();
})

app.get("/listings/:id",WrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
  res.render("show.ejs",{listing});
}))


//create Routes.......
// app.post("/listings",WrapAsync(async(req,res,next)=>{
  
//   let result=listingSchema.validate(req.body);
//   if(result.error){
//     let msg=result.error.details.map(el=>el.message).join(",");
//     throw new ExpressError(400,msg);
//   }
//   const newListing=new Listing(req.body.listing);
//   newListing.owner=req.user._id;
//   await newListing.save();
//   req.flash("success","New Listing Created......")
//   res.redirect("/allistinggg");
  
//   // console.log(listing);
// }))



// app.post(
//   "/listings",
//   upload.array("listing[images]", 5),   // accept up to 5 images
//   WrapAsync(async (req, res, next) => {
//     // ✅ Validate form data (excluding images, since they’re files)
//     let result = listingSchema.validate(req.body);
//     if (result.error) {
//       let msg = result.error.details.map((el) => el.message).join(",");
//       throw new ExpressError(400, msg);
//     }

//     // ✅ Create new listing
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;

//     // ✅ Save uploaded image paths into listing
//     if (req.files && req.files.length > 0) {
//       newListing.images = req.files.map((file) => `/uploads/${file.filename}`);
//     }

//     await newListing.save();

//     req.flash("success", "New Listing Created 🚀");
//     res.redirect("/allistinggg");
//   })
// );

//New Router
app.post( "/listings", upload.single("listing[image]"),  
WrapAsync(async (req, res, next) => {
   let result = listingSchema.validate(req.body);
   if (result.error) { let msg = result.error.details.map((el) => el.message).joi(""); throw new ExpressError(400, msg); } // Create new listing
  const newListing = new Listing(req.body.listing); newListing.owner = req.user ?req.user._id : null; // Cloudinary gives HTTPS link + public ID

  if (req.file) { newListing.image = req.file.path; // Cloudinary 
  // HTTPS URL
   newListing.imageId = req.file.filename; // Cloudinary public ID
    }
    await newListing.save(); req.flash("success", "New Listing Created 🚀"); res.redirect("/allistinggg");
   })
   );






//for reviews additions
app.post("/listings/:id/reviews",isLoggedIn,WrapAsync(async(req,res,next)=>{
  // if(!req.isAuthenticated()){
    
  //   return res.redirect("/login");
  // }
  let {id}=req.params; 
  let listing=await Listing.findById(req.params.id);
  

  let newreview=new Reviews(req.body.review);
  newreview.author=req.user._id;
  listing.reviews.push(newreview);
  await newreview.save()
  await listing.save()
  req.flash("review","Thanks you for your Feedback......")           
  res.redirect(`/listings/${id}`);
  // res.render("show.ejs",{newreview})
  // console.log(listing);
}))

// app.get(("/listings/:id/edit"),isLoggedIn,WrapAsync(async(req,res)=>{
//   // if(!req.isAuthenticated()){
    
//   //   return res.redirect("/login");
//   // }
//   let {id}=req.params;
//   const listing= await Listing.findById(id);
  
//   // req.flash("edit","Your Documents is now editted......") 
//   // req.flash("edit", "Listing updated successfully!");          
//   res.render("edit.ejs",{listing});
// }))




// app.put(("/listings/:id"),isLoggedIn,WrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   let listing=await Listing.findById(id);
  
  
//   const updatedListing=await Listing.findByIdAndUpdate(id, {...req.body.listing});  
//   req.flash("edit", "Listing updated successfully!"); 
//   res.redirect(`/listings/${id}`);
// }))

// Edit page
// EDIT PAGE
app.get(
  "/listings/:id/edit",
  isLoggedIn,
  WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("edit.ejs", { listing });
  })
);

// UPDATE LISTING (with Cloudinary upload)
app.put(
  "/listings/:id",
  isLoggedIn,
  upload.single("listing[image]"), // multer middleware
  WrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedData = { ...req.body.listing };

    // If new image uploaded → save Cloudinary URL
    if (req.file) {
      updatedData.image = req.file.path; // Cloudinary gives secure URL
    }

    await Listing.findByIdAndUpdate(id, updatedData);

    req.flash("edit", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  })
);


//post deletion
app.delete("/listings/:id",isLoggedIn,WrapAsync(async(req,res)=>{
  // if(!req.isAuthenticated()){
    
  //   return res.redirect("/login");
  // }
  let {id}=req.params;
  const deletedListing=await Listing.findByIdAndDelete(id);
  req.flash("succes", "Listing deleted successfully!");
  res.redirect("/allistinggg");
  
  
}))





    

 //reviews deletions........
 app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Reviews.findByIdAndDelete(reviewId);
  req.flash("revdel", "Review deleted successfully!");
  res.redirect(`/listings/${id}`)
}))

app.use((err,req,res,next)=>{
  let {statusCode,message}=err;
  res.render("Error.ejs",{err});
  // res.status(statusCode).send(message);
})

// app.all('/{*any}',(req,res,next)=>{
//   next(new ExpressError(404,"Page Not Found"));
// })



app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})