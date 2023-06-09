import { Key, useContext } from 'react'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
import Product from '../model/Product'
import db from '../utils/db'
import { Store } from '@/utils/Store'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Home(props: { products: any }) {

  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = async (product: { slug: any; _id: any }) => {
    const existItem = cart.cartItems.find((item: { slug: any }) => item.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity){
      return toast.error('Sorry, Product is out of stock')
    }
    dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}})
    toast.success("Product added to cart")
  }

  const { products } = props
  return (
    <Layout title='Home Page'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product: { slug: Key | null | undefined }) => (
          <ProductItem 
            product={product} 
            key={product.slug} 
            addToCartHandler={addToCartHandler}/>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find().lean()
  return {
    props: {
      products: products.map(db.convertDocToObj)
    }
  }
}