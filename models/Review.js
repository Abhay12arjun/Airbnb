
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:10
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const Reviews = mongoose.model('Reviews', reviewSchema);
export default Reviews;