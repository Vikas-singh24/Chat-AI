export function checkHeading(str) {
  return /^\*\*.+\*\*$/.test(str);
}

export function replaceHeadingStars(str) {
  return str.replace(/^\*+|\*+$/g, '');
}

export function parseInlineBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map(part => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return {
        type: "bold",
        text: part.replace(/\*\*/g, "")
      };
    }
    return {
      type: "text",
      text: part
    };
  });
}

export function isBulletLine(str) {
  return /^\*\s+/.test(str);
}

export function removeBulletStar(str) {
  return str.replace(/^\*\s+/, "");
}

export function convertBulletToDot(str) {
  return str.replace(/^\*\s+/, "• ");
}

