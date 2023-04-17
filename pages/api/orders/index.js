import { getSession } from "next-auth/react"
import db from '../../../utils/db'
import Order from "../../../model/Order"

const handler = async (req, res) => {
  const session = await getSession({ req })

  if (!session){
    return res.status(401).send('Signing required')
  }

  const { user } = session
  await db.connect()
  const newOrder = new Order({
   ...req.body,
   user: user.email 
  })

  const order = await newOrder.save()
  res.status(201).send(order)
  db.disconnect()
}

export default handler