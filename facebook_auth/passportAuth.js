import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../schemas/UserSchema.js';
import mongoose from 'mongoose';

passport.serializeUser((user, cb) => { 
    cb(null, user.id);
 });

passport.deserializeUser((id, cb) => { 
    User.findOne({id:id}, (err, user) => {   
        if (err) {
            console.log(err);
        } else {  
            cb(null,user);
        }
    });
    
});
dotenv.config();
const fbId = process.env.facebook_app_id;
const fbSecret = process.env.facebook_app_secret;
const passportAuth = passport.use(new FacebookStrategy({
    clientID: fbId,
    clientSecret: fbSecret,
    callbackURL: "http://localhost:4000/webhook",
    profileFields: ['id', 'displayName', 'email'] 
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);
    console.log("profile: ", profile);
    const userdata = {
        id: profile.id,
        name: profile.displayName,
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
