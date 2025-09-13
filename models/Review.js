
import mongoose from 'mongoose';
// const reviewSchema = new Schema({
//     comment:String,
//     rating:{
//         type:Number,
//         min:1,
//         max:10
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now()
//     },
//     author:{
//         type:Schema.Types.ObjectId,
//         ref:"User"
//     },
// })
// const Reviews = mongoose.model('Reviews', reviewSchema);
// export default Reviews;

// models/Review.js

const reviewSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
const Reviews = mongoose.model('Reviews', reviewSchema);
export default Reviews;

