import mongoose from 'mongoose';
import Reviews from './Review.js';

const Schema = mongoose.Schema;


const listingSchema = new Schema({
  title:{
    type: String,
    required:true
  }
    ,
  description:String,
  image:String,
  imageId: String,
  
  


  // image: {
  //   type:String,
  //   default:"https://wallpaperaccess.com/full/4722322.jpg",
    
  //   set:(v) => v==="" ? "https://wallpaperaccess.com/full/4722322.jpg" : v
  // } ,
  price:Number,
  location:String,
  country:String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Reviews"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"

  },
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Reviews.deleteMany({_id:{$in: listing.reviews}});
  }
})

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;