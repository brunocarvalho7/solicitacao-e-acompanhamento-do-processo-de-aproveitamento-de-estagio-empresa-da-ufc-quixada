const bcrypt = require('bcryptjs');
const tokenUtils = require('./../utils/tokenUtils');
const externalProfileUtils = require('../externals/externalProfile');
const { superAdmin } = require('../config/config');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, maxlength: 50, required: true },
    login: { type: String, maxlength: 50, required: true },
    email: { type: String, maxlength: 50, required: true },
    password: { type: String },
    course: { type: String, maxlength: 50, required: true },
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

userSchema.methods.generateAuthToken = async function generateAuthToken() {
    const user = this;
    const { name, email, login, course } = user;

    // eslint-disable-next-line no-underscore-dangle
    const token = tokenUtils.generateAuthToken(user._id, name, email, login, course);

    return token;
};

userSchema.statics.findByCredentials = async function findByCredentials(login, password) {
    const user = await this.findOne({ login });

    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            return user;
        }
    }

    return null;
};

userSchema.statics.isEmailAlreadyInUse = async function (email) {
    const user = await User.findOne({ email });

    console.log(user);

    return !!user;
};

userSchema.statics.authenticateExternalUser = async function authenticate(login, password) {
    const externalProfileData = await externalProfileUtils.getExternalProfileData(login, password);

    if (!externalProfileData.success) {
        return externalProfileData;
    }

    let user = await this.findOne({ login });

    if (!user) {
        const { name, email, course } = externalProfileData;
        const newUser = new this({
            name,
            login,
            email,
            course,
        });

        user = await newUser.save();
    }

    return {
        success: true,
        user,
    };
};

userSchema.statics.isSuperAdmin = async function isSuperAdmin(login) {
    return superAdmin && superAdmin.login === login;
};

userSchema.statics.authenticateSuperAdminUser = async function authenticate(login, password) {
    if (!this.isSuperAdmin(login)) {
        return {
            success: false,
            isAccessDenied: true,
        };
    }

    const user = await this.findByCredentials(login, password);

    if (!user) {
        return {
            success: false,
            isAccessDenied: true,
        };
    }

    return {
        success: true,
        user,
    };
};

userSchema.statics.authenticateUser = async function authenticate(login, password) {
    if (this.isSuperAdmin(login)) {
        const result = await this.authenticateSuperAdminUser(login, password);
        return result;
    }

    return this.authenticateExternalUser(login, password);
};

const User = model('User', userSchema);

module.exports = User;
