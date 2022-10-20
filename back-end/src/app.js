const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongooseConnection = require('./config/mongooseConnection');
const bootstrapSuperAdminUser = require('./config/bootstrapSuperAdminUser');

const app = express();

const index = require('./routes/index');
const userRoutes = require('./routes/user.routes');
const coordinatorRoutes = require('./routes/coordinator.routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(morgan("dev"));
app.use(cors());

app.set('mongoose connection', mongooseConnection);
app.set('set up super admin', bootstrapSuperAdminUser());

app.use(index);
app.use('/api/v1/', userRoutes);
app.use('/api/v1/coordinators', coordinatorRoutes);

module.exports = app;
