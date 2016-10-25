const gather = (prefix, updates) =>
    Object.keys(updates).map(key =>
        typeof updates[key] === 'object'
            ? gather(`${prefix}${key}.`, updates[key])
            : `${prefix}${key} = ${updates[key]}`
    ).join(', ')

module.exports = (updates) =>
    `SET ${gather('', updates)}`
