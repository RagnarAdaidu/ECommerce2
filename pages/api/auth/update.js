import db from "../../../utils/db"
import User from '../../../model/User'
import bcryptjs from 'bcryptjs'
import { getSession } from "next-auth/react"

const handler = async (req, res) => {

  if (req.method !== 'PUT'){
    return res.status(400).send({message: `${req.method} not supported`})
  }
  const session = await getSession({ req })
  if (!session){
    return res.status(401).send({message: 'signin required'})
  }

  const { user } = session

  const { name, email, password } = req.body
  console.log( user)

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect()
  const toUpdateUser = await User.findOne({email:user.email})
  toUpdateUser.email = email
  toUpdateUser.name = name

  if (password){
    toUpdateUser.password = bcryptjs.hashSync(password)
  }

  await toUpdateUser.save()
  await db.disconnect()
  res.send({message: 'User Updated'})
}

export default handler 