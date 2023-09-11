import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true,
        unique : true
    },
    name : String,
    accessToken : String
});
const User = mongoose.model('User', UserSchema);
export default User;