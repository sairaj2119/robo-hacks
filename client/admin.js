import * as admin from 'firebase-admin'
// admin.json is a super secret file that is never to be exposed 
// initialize the service account by heading to https://firebase.google.com/docs/admin/setup
// service account must be passed as json to admin.credential.cert()

import serviceAccount from './admin.json'

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const verifyIdToken = async (token) => {
  try {
    const res = await admin.auth().verifyIdToken(token)
    return res
  } catch (err) {
		return null
  }
}
