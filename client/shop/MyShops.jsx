import React, { useState, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Edit from '@mui/icons-material/Edit'
import Divider from '@mui/material/Divider'
import auth from '../auth/auth-helper.js'
import { listByOwner } from './api-shop.js'
import { Navigate, Link } from 'react-router-dom'
import DeleteShop from './DeleteShop.jsx'
import config from './../../config.js'

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
    addButton: {
        float: 'right',
    },
    leftIcon: {
        marginRight: '8px',
    },
}))

export default function MyShops() {
    const { classes } = useStyles()
    const [shops, setShops] = useState([])
    const [redirectToSignin, setRedirectToSignin] = useState(false)
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listByOwner(
            {
                userId: jwt.user._id,
            },
            { t: jwt.token },
            signal,
        ).then((data) => {
            if (data.error) {
                setRedirectToSignin(true)
            } else {
                setShops(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    const removeShop = (shop) => {
        const updatedShops = [...shops]
        const index = updatedShops.indexOf(shop)
        updatedShops.splice(index, 1)
        setShops(updatedShops)
    }

    if (redirectToSignin) {
        return <Navigate to='/signin' />
    }
    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography type='title' className={classes.title}>
                    Your Shops
                    <span className={classes.addButton}>
                        <Link to='/seller/shop/new'>
                            <Button color='primary' variant='contained'>
                                <Icon className={classes.leftIcon}>
                                    add_box
                                </Icon>{' '}
                                New Shop
                            </Button>
                        </Link>
                    </span>
                </Typography>
                <List dense>
                    {shops.map((shop, i) => {
                        return (
                            <span key={i}>
                                <ListItem button>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={
                                                `${config.BACKEND_URL}/api/shops/logo/` +
                                                shop._id +
                                                '?' +
                                                new Date().getTime()
                                            }
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={shop.name}
                                        secondary={shop.description}
                                    />
                                    {auth.isAuthenticated().user &&
                                        auth.isAuthenticated().user._id ==
                                            shop.owner._id && (
                                            <ListItemSecondaryAction>
                                                <Link
                                                    to={
                                                        '/seller/orders/' +
                                                        shop.name +
                                                        '/' +
                                                        shop._id
                                                    }
                                                >
                                                    <Button
                                                        aria-label='Orders'
                                                        color='primary'
                                                    >
                                                        View Orders
                                                    </Button>
                                                </Link>
                                                <Link
                                                    to={
                                                        '/seller/shop/edit/' +
                                                        shop._id
                                                    }
                                                >
                                                    <IconButton
                                                        aria-label='Edit'
                                                        color='primary'
                                                        size='large'
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                                <DeleteShop
                                                    shop={shop}
                                                    onRemove={removeShop}
                                                />
                                            </ListItemSecondaryAction>
                                        )}
                                </ListItem>
                                <Divider />
                            </span>
                        )
                    })}
                </List>
            </Paper>
        </div>
    )
}
