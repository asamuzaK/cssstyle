"use strict";

const parsers = require("../parsers");
const borderTopColor = require("./borderTopColor");
const borderRightColor = require("./borderRightColor");
const borderBottomColor = require("./borderBottomColor");
const borderLeftColor = require("./borderLeftColor");

const positions = ["top", "right", "bottom", "left"];

module.exports.shorthandFor = new Map([
  ["border-top-color", borderTopColor],
  ["border-right-color", borderRightColor],
  ["border-bottom-color", borderBottomColor],
  ["border-left-color", borderLeftColor]
]);

module.exports.parse = function parse(v, opt = {}) {
  const { globalObject } = opt;
  if (v === "") {
    return v;
  }
  const values = parsers.parsePropertyValue("border-color", v, {
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
        default: {
          const parsedValue = parsers.parseColor([value]);
          if (!parsedValue) {
            return;
          }
          parsedValues.push(parsedValue);
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
      this._setProperty("border-color", v);
      this._setProperty("border-width", "");
      this._setProperty("border-style", "");
      this._setProperty("border-top", "");
      this._setProperty("border-right", "");
      this._setProperty("border-bottom", "");
      this._setProperty("border-left", "");
      this._setProperty("border-image", "");
      this._setProperty("border", "");
    } else {
      this._implicitSetter("border", "color", v, module.exports.parse, positions);
      this._setProperty("border-top", "");
      this._setProperty("border-right", "");
      this._setProperty("border-bottom", "");
      this._setProperty("border-left", "");
      this._setProperty("border", "");
    }
  },
  get() {
    const val = this._implicitGetter("border", "color", positions);
    if (val === "") {
      return this.getPropertyValue("border-color");
    }
    if (parsers.hasVarFunc(val)) {
      return "";
    }
    return val;
  },
  enumerable: true,
  configurable: true
};
