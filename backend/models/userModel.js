import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('UserTest', userSchema);
export default User;