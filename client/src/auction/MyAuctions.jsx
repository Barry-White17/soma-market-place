import React, { useState, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import Paper from '@mui/material/Paper'
import Icon from '@mui/material/Icon'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import auth from '../auth/auth-helper.js'
import { listBySeller } from './api-auction.js'
import { Navigate, Link } from 'react-router-dom'
import Auctions from './Auctions.jsx'
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
export default function MyAuctions() {
    const { classes } = useStyles()
    const [auctions, setAuctions] = useState([])
    const [redirectToSignin, setRedirectToSignin] = useState(false)
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listBySeller(
            {
                userId: jwt.user._id,
            },
            { t: jwt.token },
            signal,
        ).then((data) => {
            if (data.error) {
                setRedirectToSignin(true)
            } else {
                setAuctions(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    const removeAuction = (auction) => {
        const updatedAuctions = [...auctions]
        const index = updatedAuctions.indexOf(auction)
        updatedAuctions.splice(index, 1)
        setAuctions(updatedAuctions)
    }

    if (redirectToSignin) {
        return <Navigate to='/signin' />
    }
    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography type='title' className={classes.title}>
                    Your Auctions
                    <span className={classes.addButton}>
                        <Link to='/auction/new'>
                            <Button color='primary' variant='contained'>
                                <Icon className={classes.leftIcon}>
                                    add_box
                                </Icon>{' '}
                                New Auction
                            </Button>
                        </Link>
                    </span>
                </Typography>
                <Auctions auctions={auctions} removeAuction={removeAuction} />
            </Paper>
        </div>
    )
}
