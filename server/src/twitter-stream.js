const needle = require('needle')
const twilio = require('twilio')
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// const token = process.env.TWITTER_BEARER_TOKEN

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const streamURL = 'https://api.twitter.com/2/tweets/search/stream'

async function getAllRules(token) {
  const response = await needle('get', rulesURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  if (response.statusCode !== 200) {
    console.log('Error:', response.statusMessage, response.statusCode)
    throw new Error(response.body)
  }
  return response.body
}

async function deleteAllRules(rules, token) {
  if (!Array.isArray(rules.data)) {
    return null
  }
  const ids = rules.data.map((rule) => rule.id)
  const data = {
    delete: {
      ids: ids,
    },
  }
  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
  if (response.statusCode !== 200) {
    throw new Error(response.body)
  }
  return response.body
}

async function setRules(rules, token) {
  const data = {
    add: rules,
  }
  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
  if (response.statusCode !== 201) {
    throw new Error(response.body)
  }
  return response.body
}

function streamConnect(retryAttempt, token) {
  const stream = needle.get(streamURL, {
    headers: {
      'User-Agent': 'v2FilterStreamJS',
      Authorization: `Bearer ${token}`,
    },
    timeout: 20000,
  })

  stream
    .on('data', (data) => {
      try {
        const json = JSON.parse(data)
        console.log(json)
        twilioClient.messages
          .create({
            body: 'Hello from Node',
            to: '+918688716787',
            from: '+16146543412',
          })
          .then((message) => console.log(message.sid))
        retryAttempt = 0
      } catch (e) {
        if (data.detail === 'This stream is currently at the maximum allowed connection limit.') {
          console.log(data.detail)
          process.exit(1)
        } else {
        }
      }
    })
    .on('err', (error) => {
      if (error.code !== 'ECONNRESET') {
        console.log(error.code)
        process.exit(1)
      } else {
        setTimeout(() => {
          console.warn('A connection error occurred. Reconnecting...')
          streamConnect(++retryAttempt)
        }, 2 ** retryAttempt)
      }
    })

  return stream
}

module.exports = {
  getAllRules,
  deleteAllRules,
  setRules,
  streamConnect,
}
