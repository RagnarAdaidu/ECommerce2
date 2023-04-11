import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import  CheckoutWizard from '../components/CheckoutWizard'
import { useRouter } from 'next/router'
import { Store } from '../utils/Store'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

export default function PaymentScreen() {

  const router = useRouter()

  const [ selectedPaymentMethod, setSelectedPaymentMethod ] = useState()

  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const { shippingAddress, paymentMethod } = cart

  const submitHandler = (e) => {
    e.preventDefault()

    if (!selectedPaymentMethod){
      return toast.error('Payment Method is required')
    }
    dispatch({type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod})
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod
      })
    )
    router.push('/placeorder')
  }

  useEffect(() => {
    if (!shippingAddress.address){
      return router.push('/shipping')
    }

    setSelectedPaymentMethod( paymentMethod || '')
  },[paymentMethod, router, shippingAddress.address])

  return (
    <Layout>
      <CheckoutWizard activeStep={2} />
      <form className='mx-auto max-w-screen-md' onSubmit={submitHandler}>
        <h1 className='mb-4 ext-xl'>Payment Method</h1>
        {
          ['Paypal', 'Stripe', 'PayOnDelivery'].map((payment) => (
            <div key={payment} className='mb-4'>
              <input 
                type="radio" 
                className='p-2 outline-none focus:ring-0'
                id={payment}
                name='paymentMethod'
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
              <label htmlFor={payment} className='p-2'>
                {payment}
              </label>
            </div>
          ))
        }

        <div className="mb-4 flex justify-between">
          <button 
            className="default-button"
            onClick={() => router.push('/shipping')}
            type='button'
          >
            Back
          </button>

          <button className="primary-button">
            Next
          </button>
        </div>
      </form>
    </Layout>
  )
}
