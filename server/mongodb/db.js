const mongoose = require('mongoose');
const express = require('express');
const { User } = require('./schema/User');
const { Group } = require('./schema/Group');

const dbhost = process.env.DBHOST;
mongoose.connect(dbhost);

module.exports = {
    User,
    Group,
};
