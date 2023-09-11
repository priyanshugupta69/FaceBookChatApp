import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../schemas/UserSchema.js';
import mongoose from 'mongoose';

passport.serializeUser((user, cb) => { 
    cb(null, user.id);
 });

passport.deserializeUser((id, cb) => { 
    const findUser = async () => {
        try{
            const result = await User.findOne({id:id});
            cb(null, result);
        }catch(err){
            console.log(err);
        }
      }
    findUser();
    
});
dotenv.config();
const fbId = process.env.facebook_app_id;
const fbSecret = process.env.facebook_app_secret;
const passportAuth = passport.use(new FacebookStrategy({
    clientID: fbId,
    clientSecret: fbSecret,
    callbackURL: "https://facebookchatapp.onrender.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email'] 
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);
    profile.accessToken = accessToken;
    console.log("profile: ", profile);
    const userdata = {
        id: profile.id,
        name: profile.displayName,
        accessToken: profile.accessToken
    }
    const user = new User(userdata);

    const found = async()=>{
        try{
            const result = await User.findOne({id:profile.id});
            if(result){
                console.log("user exists");
            }else{
                await user.save();
                console.log("user saved");
            }

        }catch(err){
            console.log(err);
        }
        
    }
    found();
    
   
    return cb(null, profile);
  }
));
export default passportAuth;
