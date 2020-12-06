// small module contain some utility functions like empty isset

function empty(value) {
  let undef;
  let key;
  let i;
  let len;
  const emptyValues = [undef, null, false, 0, "", "0"];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === "object") {
    for (key in mixedVar) {
      if (mixedVar.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

module.exports = {
  empty,
};
