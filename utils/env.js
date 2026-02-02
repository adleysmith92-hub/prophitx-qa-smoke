/**
 * Environment variable loader with validation
 */

const getEnvVar = (key, defaultValue) => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set and no default provided`);
  }
  return value;
};

const env = {
  baseUrl: getEnvVar('PX_BASE_URL', 'https://ss-sandbox.betprophet.co/?currency=cash'),
  email: getEnvVar('PX_EMAIL'),
  password: getEnvVar('PX_PASSWORD'),
  phone: getEnvVar('PX_PHONE'),
  firstName: getEnvVar('PX_FIRST_NAME'),
  lastName: getEnvVar('PX_LAST_NAME'),
  dateOfBirth: getEnvVar('PX_DOB'),
  addressQuery: getEnvVar('PX_ADDRESS_QUERY'),
};

module.exports = { getEnvVar, env };
