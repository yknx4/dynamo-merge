/**
 * Gets the next prefix
 * @param {String} prefix - Previous prefix
 * @param {Any} val - Value of the array
 * @param {Boolean} isFromArray - true if the value became originally from an array
 * @returns {String} - Next prefix
 */
const getNextPrefix = (prefix, val, isFromArray) => {
  if (isFromArray) {
    return prefix
  }

  if (!isFromArray && prefix === "") {
    return val
  }

  return `${prefix}.${val}`
}

/**
 * @param {string} prefix - Current prefix
 * @param {object|array} updates - Current set of updates
 * @param {{sets, adds}} accumulator - Object containing set of adds and sets
 * @param {string} type - type of item to add to
 * @returns {{sets, adds}} - Object containing set of adds and sets
 */
const merge = (prefix, updates, accumulator, type) => {
  const typeOfUpdates = typeof updates
  const separator = type === "sets" ? " = " : " "
  let newAcc = Object.assign({}, accumulator)

  if (updates === null || typeOfUpdates === "undefined") {
    return newAcc
  } else if (typeOfUpdates === "function") {
    newAcc = Object.assign({}, merge(prefix, updates(), newAcc, type))
  } else if (typeOfUpdates === "object") {
    const isFromArray = Array.isArray(updates)
    const arr = isFromArray ? updates : Object.keys(updates)

    arr.forEach((val) => {
      const value = isFromArray ? val : updates[val]
      newAcc = merge(getNextPrefix(prefix, val, isFromArray), value, newAcc, Array.isArray(value) ? "adds" : type)
    })
  } else if (typeOfUpdates !== "number") {
    newAcc[type].push(`${prefix}${separator}"${updates}"`)
  } else {
    newAcc[type].push(`${prefix}${separator}${updates}`)
  }
  return newAcc
}

module.exports = (updates) => {
  const { sets, adds } = merge("", updates, { sets: [], adds: [] }, "sets")

  const addsString = adds.length ? `ADD ${adds.join(", ")}` : ""
  const setsString = sets.length ? `SET ${sets.join(", ")}` : ""

  return { UpdateExpression: `${setsString} ${addsString}`.trim() }
}
