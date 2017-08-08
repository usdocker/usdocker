'use strict';

const path = require('path');

module.exports = {
    setup: function()
    {
        return 'setup command';
    },

    up: function()
    {
        return 'up command';
    },

    down: function()
    {
        return 'down command';
    },

    expose: function (program) {

    }
};