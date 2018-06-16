const mongoose = require('mongoose');
const express = require('express');
const { User } = require('./schema/User');

const dbhost = process.env.DBHOST;
mongoose.connect(dbhost);

module.exports = { User };
