'use strict';

module.exports.definition = {
    set: function (v) {
        this.setProperty('-webkit-animation-direction', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation-direction');
    },
    enumerable: true
};