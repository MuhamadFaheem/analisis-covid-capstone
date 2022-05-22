'use strict'
var con = require('./connection')
var response = require('./res')

exports.index = function (req, res) {
    response.ok("REST API Application works", res)
}