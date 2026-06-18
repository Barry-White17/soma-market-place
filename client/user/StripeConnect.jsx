import React, { useState, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import queryString from 'query-string'
import { stripeUpdate } from './api-user.js'
import auth from '../auth/auth-helper.js'

const useStyles = makeStyles()((theme) => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5),
    }),
    title: {
        margin: `${theme.spacing(3)} 0 ${theme.spacing(2)} ${theme.spacing(2)}`,
        color: theme.palette.protectedTitle,
        fontSize: '1.1em',
    },
    subheading: {
        color: theme.palette.openTitle,
        marginLeft: '24px',
    },
}))

export default function StripeConnect(props) {
    const { classes } = useStyles()
    const [values, setValues] = useState({
        error: false,
        connecting: false,
        connected: false,
    })
    const jwt = auth.isAuthenticated()
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        const parsed = queryString.parse(props.location.search)
        if (parsed.error) {
            setValues({ ...values, error: true })
        }
        if (parsed.code) {
            setValues({ ...values, connecting: true, error: false })
            //post call to stripe, get credentials and update user data
            stripeUpdate(
                {
                    userId: jwt.user._id,
                },
                {
                    t: jwt.token,
                },
                parsed.code,
                signal,
            ).then((data) => {
                if (data.error) {
                    setValues({
                        ...values,
                        error: true,
                        connected: false,
                        connecting: false,
                    })
                } else {
                    setValues({
                        ...values,
                        connected: true,
                        connecting: false,
                        error: false,
                    })
                }
            })
        }
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography type='title' className={classes.title}>
                    Connect your Stripe Account
                </Typography>
                {values.error && (
                    <Typography
                        type='subheading'
                        className={classes.subheading}
                    >
                        Could not connect your Stripe account. Try again later.
                    </Typography>
                )}
                {values.connecting && (
                    <Typography
                        type='subheading'
                        className={classes.subheading}
                    >
                        Connecting your Stripe account ...
                    </Typography>
                )}
                {values.connected && (
                    <Typography
                        type='subheading'
                        className={classes.subheading}
                    >
                        Your Stripe account successfully connected!
                    </Typography>
                )}
            </Paper>
        </div>
    )
}
