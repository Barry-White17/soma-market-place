import React, { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import AddCartIcon from '@mui/icons-material/AddShoppingCart'
import DisabledCartIcon from '@mui/icons-material/RemoveShoppingCart'
import cart from './cart-helper.js'
import { Navigate } from 'react-router-dom'

const useStyles = makeStyles()((theme) => ({
    iconButton: {
        width: '28px',
        height: '28px',
    },
    disabledIconButton: {
        color: '#7f7563',
        width: '28px',
        height: '28px',
    },
}))

export default function AddToCart(props) {
    const { classes } = useStyles()
    const [redirect, setRedirect] = useState(false)

    const addToCart = () => {
        cart.addItem(props.item, () => {
            setRedirect({ redirect: true })
        })
    }
    if (redirect) {
        return <Navigate to={'/cart'} />
    }
    return (
        <span>
            {props.item.quantity >= 0 ? (
                <IconButton
                    color='secondary'
                    dense='dense'
                    onClick={addToCart}
                    size='large'
                >
                    <AddCartIcon
                        className={props.cartStyle || classes.iconButton}
                    />
                </IconButton>
            ) : (
                <IconButton
                    disabled={true}
                    color='secondary'
                    dense='dense'
                    size='large'
                >
                    <DisabledCartIcon
                        className={
                            props.cartStyle || classes.disabledIconButton
                        }
                    />
                </IconButton>
            )}
        </span>
    )
}

AddToCart.propTypes = {
    item: PropTypes.object.isRequired,
    cartStyle: PropTypes.string,
}
