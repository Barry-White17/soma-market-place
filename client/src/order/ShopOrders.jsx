import React, { useState, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import auth from '../auth/auth-helper.js'
import { listByShop } from './api-order.js'
import ProductOrderEdit from './ProductOrderEdit.jsx'
import { useParams } from 'react-router-dom'

const useStyles = makeStyles()((theme) => ({
    root: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5),
    },
    title: {
        margin: `${theme.spacing(3)} 0 ${theme.spacing(3)} ${theme.spacing(1)}`,
        color: theme.palette.protectedTitle,
        fontSize: '1.2em',
    },
    subheading: {
        marginTop: theme.spacing(1),
        color: '#434b4e',
        fontSize: '1.1em',
    },
    customerDetails: {
        paddingLeft: '36px',
        paddingTop: '16px',
        backgroundColor: '#f8f8f8',
    },
}))
export default function ShopOrders() {
    const { classes } = useStyles()
    const { shopId, shop } = useParams()
    const [orders, setOrders] = useState([])
    const [open, setOpen] = useState(0)

    const jwt = auth.isAuthenticated()
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listByShop(
            {
                shopId: shopId,
            },
            { t: jwt.token },
            signal,
        ).then((data) => {
            if (data.error) {
                console.log(data)
            } else {
                setOrders(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    const handleClick = (index) => (event) => {
        setOpen(index)
    }

    const updateOrders = (index, updatedOrder) => {
        let updatedOrders = orders
        updatedOrders[index] = updatedOrder
        setOrders([...updatedOrders])
    }

    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography type='title' className={classes.title}>
                    Orders in {shop}
                </Typography>
                <List dense>
                    {orders.map((order, index) => {
                        return (
                            <span key={index}>
                                <ListItem button onClick={handleClick(index)}>
                                    <ListItemText
                                        primary={'Order # ' + order._id}
                                        secondary={new Date(
                                            order.created,
                                        ).toDateString()}
                                    />
                                    {open == index ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    )}
                                </ListItem>
                                <Divider />
                                <Collapse
                                    component='li'
                                    in={open == index}
                                    timeout='auto'
                                    unmountOnExit
                                >
                                    <ProductOrderEdit
                                        shopId={match.params.shopId}
                                        order={order}
                                        orderIndex={index}
                                        updateOrders={updateOrders}
                                    />
                                    <div className={classes.customerDetails}>
                                        <Typography
                                            type='subheading'
                                            component='h3'
                                            className={classes.subheading}
                                        >
                                            Deliver to:
                                        </Typography>
                                        <Typography
                                            type='subheading'
                                            component='h3'
                                            color='primary'
                                        >
                                            <strong>
                                                {order.customer_name}
                                            </strong>{' '}
                                            ({order.customer_email})
                                        </Typography>
                                        <Typography
                                            type='subheading'
                                            component='h3'
                                            color='primary'
                                        >
                                            {order.delivery_address.street}
                                        </Typography>
                                        <Typography
                                            type='subheading'
                                            component='h3'
                                            color='primary'
                                        >
                                            {order.delivery_address.city},{' '}
                                            {order.delivery_address.state}{' '}
                                            {order.delivery_address.zipcode}
                                        </Typography>
                                        <Typography
                                            type='subheading'
                                            component='h3'
                                            color='primary'
                                        >
                                            {order.delivery_address.country}
                                        </Typography>
                                        <br />
                                    </div>
                                </Collapse>
                                <Divider />
                            </span>
                        )
                    })}
                </List>
            </Paper>
        </div>
    )
}
