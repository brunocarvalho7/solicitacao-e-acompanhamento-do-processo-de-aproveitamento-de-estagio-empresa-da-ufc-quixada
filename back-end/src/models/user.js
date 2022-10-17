const bcrypt = require('bcryptjs');
const tokenUtils = require('./../utils/tokenUtils');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, maxlength: 50, required: true },
    email: { type: String, maxlength: 50, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = tokenUtils.generateAuthToken(user._id, user.name, user.email);

    return token;
}

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Login inválido");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("Login inválido");
    }

    return user;
};

userSchema.statics.isEmailAlreadyInUse = async function (email) {
    const user = await User.findOne({ email });

    console.log(user);

    return !!user;
}

const User = model('User', userSchema);

module.exports = User;
