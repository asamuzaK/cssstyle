"use strict";

const parsers = require("../parsers");
const borderTopStyle = require("./borderTopStyle");
const borderRightStyle = require("./borderRightStyle");
const borderBottomStyle = require("./borderBottomStyle");
const borderLeftStyle = require("./borderLeftStyle");

const positions = ["top", "right", "bottom", "left"];

module.exports.shorthandFor = new Map([
  ["border-top-style", borderTopStyle],
  ["border-right-style", borderRightStyle],
  ["border-bottom-style", borderBottomStyle],
  ["border-left-style", borderLeftStyle]
]);

module.exports.parse = function parse(v, opt = {}) {
  const { globalObject } = opt;
  if (v === "") {
    return v;
  }
  const values = parsers.parsePropertyValue("border-style", v, {
    globalObject,
    inArray: true
  });
  const parsedValues = [];
  if (Array.isArray(values) && values.length) {
    if (values.length > 4) {
      return;
    }
    for (const value of values) {
      const { name, type } = value;
      switch (type) {
        case "GlobalKeyword": {
          if (values.length !== 1) {
            return;
          }
          parsedValues.push(name);
          break;
        }
        case "Identifier": {
          parsedValues.push(name);
          break;
        }
        default: {
          return;
        }
      }
    }
  } else if (typeof values === "string") {
    parsedValues.push(values);
  }
  if (parsedValues.length) {
    return parsedValues.join(" ");
  }
};

module.exports.definition = {
  set(v) {
    v = parsers.prepareValue(v, this._global);
    if (parsers.hasVarFunc(v)) {
      this._setProperty("border-style", v);
      this._setProperty("border-width", "");
      this._setProperty("border-color", "");
      this._setProperty("border-top", "");
      this._setProperty("border-right", "");
      this._setProperty("border-bottom", "");
      this._setProperty("border-left", "");
      this._setProperty("border-image", "");
      this._setProperty("border", "");
    } else {
      this._implicitSetter("border", "style", v, module.exports.parse, positions);
      this._setProperty("border-top", "");
      this._setProperty("border-right", "");
      this._setProperty("border-bottom", "");
      this._setProperty("border-left", "");
      this._setProperty("border", "");
    }
  },
  get() {
    const val = this._implicitGetter("border", "style", positions);
    if (val === "") {
      return this.getPropertyValue("border-style");
    }
    if (parsers.hasVarFunc(val)) {
      return "";
    }
    return val;
  },
  enumerable: true,
  configurable: true
};
