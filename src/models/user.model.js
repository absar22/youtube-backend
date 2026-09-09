import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:[true, 'Full name is required'],
        trim:true,
        index:true
    },
    avatar:{
        type:String,  
        required:true 
    },
    coverImage:{
        type:String,
    },
    password:{
        type:String,
        required: [true, 'Password is required']
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
            
        }
    ],
    refreshToken:{
        type:String,
    }
},{timestamps:true}) 


// Hash the password before saving using pre middleware using mongoose
// pre("save") → middleware that runs before MongoDB save
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return 
    this.password = await bcrypt.hash(this.password,10)
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)

}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}

export const User = mongoose.model('User',userSchema)
