const joi = require('@hapi/joi')
const { camelCase, mapKeys, mapValues, isPlainObject } = require('lodash')

/**
 * Validates, sanitize and format process.env against joi schema
 *
 * @param {Function} fn Callback function that receieves joi a should return joi schema or
 *               joi schema itself
 * @param {Object} obj Optional object, defaults to process.env
 * @returns {Object} Parsed object
 */
function parse(fn, obj) {
  if (!obj) obj = process.env

  const schema = typeof fn === 'function' ? fn(joi) : fn

  const { error, value } = joi.validate(obj, schema, { stripUnknown: true })

  if (error) throw error

  return format(value)
}

/**
 * Given a 1-level object of uppercase constants returns
 * a nested object using camelCased keys
 *
 * @param {Object} input
 * @returns {Object}
 */
function format(input) {
  const output = {}
  Object.keys(input).forEach(key => {
    const [, parent, sub] = key.match(/^(.*?)__(.*)$/) || []
    if (parent) {
      if (!output[parent]) output[parent] = {}
      output[parent][sub] = input[key]
    } else {
      output[key] = input[key]
    }
  })

  const cameled = mapKeys(output, (v, k) => camelCase(k.toUpperCase()))

  return mapValues(cameled, v => (isPlainObject(v) ? format(v) : v))
}

module.exports = { parse, format }
