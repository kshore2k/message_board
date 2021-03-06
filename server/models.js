var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

mongoose.connect('mongodb://localhost/whats_good', { useNewUrlParser: true });

var CommentSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    username: {type: String, required: true},
    comment: {type: String, required: [true, "Comment Cannot Be Blank"]}
}, { timestamps: true })

var PostSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    username: {type: String, required: true},
    title: {type: String, required: [true, "Post Must Have Title"]},
    content: {type: String, required: [true, "Post Cannot Be Blank"]},
    comments: [CommentSchema]
}, { timestamps: true })

var UserSchema = new mongoose.Schema({
    first_name: {type: String, required: [true, "First Name Required"]},
    last_name: {type: String, required: [true, "Last Name Required"]},
    email: {type: String, required: [true, "Email Required"]},
    username: {type: String, required: [true, "Username Required"], minlength: [5, "Minimun 5 Characters"]},
    password: {type: String, required: [true, "Password Required"]},
    level: {type: String, default: "Junior Member", required: false},
    avatar: {type: String, default: "https://pictshare.net/9m4t0r.png", required: false},
    posts: {type: Number, default: 0, required: false}
}, { timestamps: true })

// Need to Fix unique Validator & add unique: true to username and email in UserSchema
// FriendsSchema is throwing dup key error when trying to add a friend that is already someone else's friend

// UserSchema.plugin(uniqueValidator);

var FriendSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    friends: [UserSchema]
}, { timestamps: true })

module.exports = {
    User: mongoose.model('User', UserSchema),
    Post: mongoose.model('Post', PostSchema),
    Friend: mongoose.model('Friend', FriendSchema)
}