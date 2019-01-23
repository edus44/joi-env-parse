const { format } = require('..')
const joi = require('joi')

describe('format', () => {
  it('should camel-case keys', () => {
    const env = {
      MONGO_URI: 'mongodb://localhost',
      MY_nicE_ENV_Var: 'val',
    }
    const expected = {
      mongoUri: 'mongodb://localhost',
      myNiceEnvVar: 'val',
    }

    expect(format(env)).toMatchObject(expected)
  })
  it('should return nested object', () => {
    const env = {
      MONGO_URI: 'mongodb://localhost',
      REDIS__HOST: 'localhost',
      REDIS__DB: '1',
      MISC__SERVICES__API1: 'val1',
      MISC__SERVICES__API2: 'val2',
      NESTED__OBJ__FOO__BAR: 'myvalue',
    }
    const expected = {
      mongoUri: 'mongodb://localhost',
      redis: { host: 'localhost', db: '1' },
      misc: { services: { api1: 'val1', api2: 'val2' } },
      nested: { obj: { foo: { bar: 'myvalue' } } },
    }

    expect(format(env)).toMatchObject(expected)
  })
})
