const { nanoid } = require('nanoid');

const generateCode = () => {
  return nanoid(8);
};

const isValidCustomCode = (code) => {
  const regex = /^[a-zA-Z0-9_-]{4,50}$/;
  return regex.test(code);
};

module.exports = {
  generateCode,
  isValidCustomCode
};