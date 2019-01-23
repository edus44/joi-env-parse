const { parse } = require('..')
const joi = require('joi')

describe('parse', () => {
  it('should clean env', () => {
    const env = {
      OTHER: 'other',
      NODE_ENV: 'development',
    }
    const schema = {
      NODE_ENV: joi
        .string()
        .required()
        .valid('development', 'production'),
    }
    const expected = { nodeEnv: 'development' }

    expect(parse(schema, env)).toMatchObject(expected)
  })
  it('should clean env', () => {
    const env = {
      OTHER: 'other',
      NODE_ENV: 'development',
    }
    const schema = {
      NODE_ENV: joi
        .string()
        .required()
        .valid('development', 'production'),
    }
    const expected = { nodeEnv: 'development' }

    expect(parse(schema, env)).toMatchObject(expected)
  })
  it('should use function schema', () => {
    const env = {
      OTHER: 'other',
      NODE_ENV: 'development',
    }
    const schema = joi => ({
      NODE_ENV: joi
        .string()
        .required()
        .valid('development', 'production'),
    })
    const expected = { nodeEnv: 'development' }

    expect(parse(schema, env)).toMatchObject(expected)
  })

  it('should throw if required values', () => {
    const env = {
      OTHER: 'other',
    }
    const schema = {
      NODE_ENV: joi
        .string()
        .required()
        .valid('development', 'production'),
    }

    expect(() => parse(schema, env)).toThrowError(joi.ValidationError)
  })

  it('should apply defaults', () => {
    const env = {}
    const schema = {
      NODE_ENV: joi
        .string()
        .default('production')
        .valid('development', 'production'),
    }
    const expected = { nodeEnv: 'production' }

    expect(parse(schema, env)).toMatchObject(expected)
  })

  it('should cast values', () => {
    const env = {
      LISTEN_PORT: '1234',
      WHITELIST: '[100,200,"300"]',
      PARAMS: '{"foo":"bar"}',
    }
    const schema = {
      LISTEN_PORT: joi.number().required(),
      WHITELIST: joi.array().required(),
      PARAMS: joi.object().required(),
    }
    const expected = {
      listenPort: 1234,
      whitelist: [100, 200, '300'],
      params: { foo: 'bar' },
    }

    expect(parse(schema, env)).toMatchObject(expected)
  })
})
