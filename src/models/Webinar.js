import mongoose from 'mongoose';

const webinarSchema = mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  duration: Number,
  price: Number,
  agenda: [String],
  speakers: [
    {
      name: String,
      regalia: String,
    },
  ],
  testimonials: [
    {
      author: String,
      text: String,
    },
  ],
});

export default mongoose.models.Webinar ||
  mongoose.model('Webinar', webinarSchema);
