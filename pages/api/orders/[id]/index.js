// /api/orders/:id

import { getSession } from "next-auth/react"
import db from "../../../../utils/db"
import Order from "../../../../model/Order"

const handler = async (req, res) => {
  const session = await getSession({ req })

  if (!session){
    return res.status(401).send('Signin Required')
  }

  await db.connect()

  const order = await Order.findById(req.query.id)
  await db.disconnect()
  res.send(order)
}

export default handler