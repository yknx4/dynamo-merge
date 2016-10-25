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

  if (typeOfUpdates === "function") {
    newAcc = Object.assign({}, merge(prefix, updates(), newAcc, type))
  } else if (Array.isArray(updates)) {
    updates.forEach((value) => {
      if (typeof value === "object") {
        newAcc = Object.assign({}, merge(prefix, value, newAcc, Array.isArray(value) ? "adds" : "sets"))
      } else {
        merge(prefix, value, newAcc, type)
      }
    })
  } else if (typeOfUpdates === "object") {
    Object.keys(updates).forEach((key) => {
      const value = updates[key]
      const typeOfValue = typeof value
      const nextPrefix = `${prefix !== "" ? `${prefix}.` : ""}${key}`

      if (typeOfValue === "object") {
        newAcc = merge(`${nextPrefix}`, value, newAcc, Array.isArray(value) ? "adds" : "sets")
      } else {
        newAcc = merge(nextPrefix, value, newAcc, type)
      }
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
  const setsString = sets.length ? `SET ${sets.join(", ")} ` : ""

  return { UpdateExpression: `${setsString}${addsString}`.trim() }
}
