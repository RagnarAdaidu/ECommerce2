import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import data from '../../utils/data'
import Layout from '../../components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { Store } from '../../utils/Store'

export default function ProductScreen() {

  const { state, dispatch } = useContext(Store)
  const { query } = useRouter()
  const { slug } = query
  const product = data.products.find(x => x.slug === slug)

  const router = useRouter()

  if (!product){
    return <div>Product not found</div>
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((item) => item.slug === product.slug)
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (product.countInStock < quantity){
      return alert('Sorry, Product is out of stock')
    }
    dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}})
    router.push('/cart')
  }

  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link href='/'>
          Back to products
        </Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout= 'responsive'
          ></Image>
        </div>

        <div> 
          <div className='card p-5'>
            <ul>
              <li>
                <h1 className='text-3xl font-bold'>{product.name}</h1>
              </li>
              <li className='text-xl'>Category:{product.category} </li>
              <li className='text-xl'>Brand:{product.brand} </li>
              <li className='text-xl'>
                {product.rating} of {product.numReviews} reviews
              </li>
              <li className='text-xl'>Description:{product.description} </li>
            </ul>
          </div>
        </div>

        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>${product.price} </div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In Stock' : 'Unavailable' } </div>
            </div>
            <button 
              className='primary-button w-full' 
              onClick={addToCartHandler}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
