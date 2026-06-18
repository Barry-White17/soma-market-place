import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { makeStyles } from 'tss-react/mui'
import CartItems from './CartItems'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Checkout from './Checkout.jsx'
import config from './../../config.js'

// Stripe Provider is available to setup Stripe Context for entire component tree

const useStyles = makeStyles()((theme) => ({
    root: {
        flexGrow: 1,
        margin: 30,
    },
}))

// Loading stripe.js
const stripe = loadStripe(config.stripe_test_api_key)
const options = {
    client_secret: config.stripe_connect_test_client_id,
}
export default function Cart() {
    const { classes } = useStyles()
    const [checkout, setCheckout] = useState(false)

    const showCheckout = (val) => {
        setCheckout(val)
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={8}>
                <Grid item xs={6} sm={6}>
                    <CartItems checkout={checkout} setCheckout={showCheckout} />
                </Grid>
                {checkout && (
                    <Grid item xs={6} sm={6}>
                        <Elements stripe={stripe} options={options}>
                            <Checkout />
                        </Elements>
                    </Grid>
                )}
            </Grid>
        </div>
    )
}
