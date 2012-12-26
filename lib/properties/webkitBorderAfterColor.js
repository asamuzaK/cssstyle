'use strict';

var parseColor = require('../parsers').parseColor;

module.exports.definition = {
    set: function (v) {
        this.setProperty('-webkit-border-after-color', parseColor(v));
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-after-color');
    },
    enumerable: true
};