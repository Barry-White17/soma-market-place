import React, { useState, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { list } from './api-shop.js'
import { Link } from 'react-router-dom'
import config from './../../config.js'

const useStyles = makeStyles()((theme) => ({
    root: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(3),
    },
    title: {
        margin: `${theme.spacing(3)} 0 ${theme.spacing(2)}`,
        color: theme.palette.protectedTitle,
        textAlign: 'center',
        fontSize: '1.2em',
    },
    avatar: {
        width: 100,
        height: 100,
    },
    subheading: {
        color: theme.palette.text.secondary,
    },
    shopTitle: {
        fontSize: '1.2em',
        marginBottom: '5px',
    },
    details: {
        padding: '24px',
    },
}))
export default function Shops() {
    const { classes } = useStyles()
    const [shops, setShops] = useState([])

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setShops(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography type='title' className={classes.title}>
                    All Shops
                </Typography>
                <List dense>
                    {shops.map((shop, i) => {
                        return (
                            <Link to={'/shops/' + shop._id} key={i}>
                                <Divider />
                                <ListItem button>
                                    <ListItemAvatar>
                                        <Avatar
                                            className={classes.avatar}
                                            src={
                                                `${config.BACKEND_URL}/api/shops/logo/` +
                                                shop._id +
                                                '?' +
                                                new Date().getTime()
                                            }
                                        />
                                    </ListItemAvatar>
                                    <div className={classes.details}>
                                        <Typography
                                            type='headline'
                                            component='h2'
                                            color='primary'
                                            className={classes.shopTitle}
                                        >
                                            {shop.name}
                                        </Typography>
                                        <Typography
                                            type='subheading'
                                            component='h4'
                                            className={classes.subheading}
                                        >
                                            {shop.description}
                                        </Typography>
                                    </div>
                                </ListItem>
                                <Divider />
                            </Link>
                        )
                    })}
                </List>
            </Paper>
        </div>
    )
}
