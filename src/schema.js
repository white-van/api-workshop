
import mongoose from 'mongoose';
const { Schema } = mongoose;

const MoonSchema = new Schema({
  name: String,
  planet: String,
  sizeOfMoon: Number
}, { toObject: { versionKey: false }});

// Schema for moon
const RoverSchema = new Schema({
  name: String,
  description: String,
  MoonsVisited: [mongoose.ObjectId],
  dateCreated: Date,

}, { toObject: { versionKey: false }});

const Rover = mongoose.model('rovers', RoverSchema);

const Moon = mongoose.model('moons', MoonSchema);

export {
  Rover,
  Moon
}