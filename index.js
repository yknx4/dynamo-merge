const gather = (prefix, updates) =>
    Object.keys(updates).map(key =>
        typeof updates[key] === 'object'
            ? gather(`${prefix}${key}.`, updates[key])
            : `${prefix}${key} = ${JSON.stringify(updates[key])}`
    ).join(', ')

module.exports = (updates) => ({
    UpdateExpression: `SET ${gather('', updates)}`,
})
