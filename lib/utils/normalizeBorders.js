"use strict";

const { hasVarFunc, splitValue } = require("../parsers");

module.exports.implicitPositionProperties = new Map([
  [
    "border-top",
    new Map([
      ["border-width", "medium"],
      ["border-style", "none"],
      ["border-color", "currentcolor"]
    ])
  ],
  [
    "border-right",
    new Map([
      ["border-width", "medium"],
      ["border-style", "none"],
      ["border-color", "currentcolor"]
    ])
  ],
  [
    "border-bottom",
    new Map([
      ["border-width", "medium"],
      ["border-style", "none"],
      ["border-color", "currentcolor"]
    ])
  ],
  [
    "border-left",
    new Map([
      ["border-width", "medium"],
      ["border-style", "none"],
      ["border-color", "currentcolor"]
    ])
  ]
]);

const nomalizePositionedLonghands = (properties, items) => {
  const [widthProperty, styleProperty, colorProperty] = items;
  if (
    properties.has(widthProperty) &&
    properties.has(styleProperty) &&
    properties.has(colorProperty)
  ) {
    const [, widthValue, widthPriority] = properties.get(widthProperty);
    const [, styleValue, stylePriority] = properties.get(styleProperty);
    const [, colorValue, colorPriority] = properties.get(colorProperty);
    if (!hasVarFunc(widthValue) && !widthPriority) {
      properties.delete(widthProperty);
    }
    if (!hasVarFunc(styleValue) && !stylePriority) {
      properties.delete(styleProperty);
    }
    if (!hasVarFunc(colorValue) && !colorPriority) {
      properties.delete(colorProperty);
    }
  }
  return properties;
};

const normalizeBorderShorthand = (properties, items) => {
  const [widthProperty, styleProperty, colorProperty] = items;
  const [, widthValue, widthPriority] = properties.get(widthProperty);
  const [, styleValue, stylePriority] = properties.get(styleProperty);
  const [, colorValue, colorPriority] = properties.get(colorProperty);
  if (
    widthValue &&
    splitValue(widthValue).length === 1 &&
    !hasVarFunc(widthValue) &&
    !widthPriority &&
    styleValue &&
    splitValue(styleValue).length === 1 &&
    !hasVarFunc(styleValue) &&
    !stylePriority &&
    colorValue &&
    splitValue(colorValue).length === 1 &&
    !hasVarFunc(colorValue) &&
    !colorPriority
  ) {
    const initialValues = new Map([
      [widthProperty, "medium"],
      [styleProperty, "none"],
      [colorProperty, "currentcolor"]
    ]);
    const borderValues = new Map([
      [widthProperty, widthValue],
      [styleProperty, styleValue],
      [colorProperty, colorValue]
    ]);
    const obj = {};
    for (const [key, borderValue] of borderValues) {
      const initialValue = initialValues.get(key);
      if (key === widthProperty) {
        obj[key] = borderValue;
      } else if (borderValue !== initialValue) {
        obj[key] = borderValue;
        if (obj[widthProperty] && obj[widthProperty] === initialValues.get(widthProperty)) {
          delete obj[widthProperty];
        }
      }
    }
    properties.delete(widthProperty);
    properties.delete(styleProperty);
    properties.delete(colorProperty);
    if (properties.has("border-image")) {
      const [, imageValue, imagePriority] = properties.get("border-image");
      if (imageValue === "none" && !imagePriority) {
        properties.delete("border-image");
      }
    }
    properties.set("border", ["border", Object.values(obj).join(" "), null]);
  }
  return properties;
};

module.exports.normalizeBorderProperties = function (properties) {
  // normalize positioned longhands
  if (
    properties.has("border-top") &&
    properties.has("border-right") &&
    properties.has("border-bottom") &&
    properties.has("border-left")
  ) {
    nomalizePositionedLonghands(properties, [
      "border-top-width",
      "border-top-style",
      "border-top-color"
    ]);
    nomalizePositionedLonghands(properties, [
      "border-right-width",
      "border-right-style",
      "border-right-color"
    ]);
    nomalizePositionedLonghands(properties, [
      "border-bottom-width",
      "border-bottom-style",
      "border-bottom-color"
    ]);
    nomalizePositionedLonghands(properties, [
      "border-left-width",
      "border-left-style",
      "border-left-color"
    ]);
    // normalize longhands
  } else if (
    properties.has("border-width") &&
    properties.has("border-style") &&
    properties.has("border-color")
  ) {
    nomalizePositionedLonghands(properties, [
      "border-top-width",
      "border-top-style",
      "border-top-color"
    ]);
    nomalizePositionedLonghands(properties, [
      "border-right-width",
      "border-right-style",
      "border-right-color"
    ]);
    nomalizePositionedLonghands(properties, [
      "border-bottom-width",
      "border-bottom-style",
      "border-bottom-color"
    ]);
    nomalizePositionedLonghands(properties, [
      "border-left-width",
      "border-left-style",
      "border-left-color"
    ]);
  }
  // normalize border shorthand
  if (
    properties.has("border-width") &&
    properties.has("border-style") &&
    properties.has("border-color") &&
    !properties.has("border")
  ) {
    normalizeBorderShorthand(properties, ["border-width", "border-style", "border-color"]);
  }
  return properties;
};
