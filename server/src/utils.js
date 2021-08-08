const fs = require('fs')
const path = require('path')
const rules = require('./rules.json')

const writeToRules = (rule, empty) => {
  if (empty) {
    fs.writeFileSync(path.join(__dirname, 'rules.json'), JSON.stringify([], null, 2))
    return
  }
  const newRules = [...rules, rule]
  fs.writeFileSync(path.join(__dirname, 'rules.json'), JSON.stringify(newRules, null, 2))
}

module.exports = {
  writeToRules,
}
