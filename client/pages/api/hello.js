// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { verifyIdToken } from '../../admin'

export default async (req, res) => {
  const bearerToken = req.headers['authorization']
  if (!bearerToken) {
    res.status(400).json({
      error: 'Unauthorized',
    })
    return
  }
  const idToken = bearerToken.replace('Bearer ', '')
  const idTokenVerified = await verifyIdToken(idToken)
  if (!idTokenVerified) {
    res.status(400).json({
      error: 'Unauthorized',
    })
    return
  }

  res.status(200).json({ name: 'John Doe' })
}
