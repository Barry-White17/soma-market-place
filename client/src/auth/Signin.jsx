import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'
import { makeStyles } from 'tss-react/mui'
import auth from './auth-helper.js'
import { Navigate } from 'react-router-dom'
import { signin } from './api-auth.js'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles()((theme) => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2),
    },
    error: {
        verticalAlign: 'middle',
    },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2),
    },
}))

export default function Signin(props) {
    const { classes } = useStyles()
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToReferrer: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const handlePassword = () => {
        setShowPassword(!showPassword)
    }
    const clickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined,
        }

        signin(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                auth.authenticate(data, () => {
                    setValues({
                        ...values,
                        error: '',
                        redirectToReferrer: true,
                    })
                })
            }
        })
    }

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value })
    }

    if (values.redirectToReferrer) {
        return <Navigate to='/' />
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant='h5' className={classes.title}>
                    Sign In
                </Typography>
                <TextField
                    id='email'
                    type='email'
                    label='Email'
                    className={classes.textField}
                    value={values.email}
                    onChange={handleChange('email')}
                    margin='normal'
                />
                <br />
                <TextField
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    label='Password'
                    className={classes.textField}
                    value={values.password}
                    onChange={handleChange('password')}
                    margin='normal'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment>
                                <IconButton onClick={handlePassword}>
                                    {showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <br />{' '}
                {values.error && (
                    <Typography component='p' color='error'>
                        <Icon color='error' className={classes.error}>
                            error
                        </Icon>
                        {values.error}
                    </Typography>
                )}
            </CardContent>
            <CardActions>
                <Button
                    color='primary'
                    variant='contained'
                    onClick={clickSubmit}
                    className={classes.submit}
                >
                    Submit
                </Button>
            </CardActions>
        </Card>
    )
}
