import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import Button from '@mui/material/Button'
import auth from '../auth/auth-helper'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CartIcon from '@mui/icons-material/ShoppingCart'
import Badge from '@mui/material/Badge'
import cart from '../cart/cart-helper'
import PeopleIcon from '@mui/icons-material/People'
import StoreIcon from '@mui/icons-material/Store'

const isActive = (history, path) => {
    if (history.pathname == path) return { color: '#bef67a' }
    else return { color: '#ffffff' }
}
const isPartActive = (history, path) => {
    if (history.pathname.includes(path)) return { color: '#bef67a' }
    else return { color: '#ffffff' }
}
const Menu = () => {
    const history = useLocation()
    const navigate = useNavigate()
    return (
        <AppBar position='static'>
            <Toolbar>
                <Typography variant='h6' color='inherit'>
                    Soma Shop
                </Typography>
                <div>
                    <Link to='/'>
                        <IconButton
                            aria-label='Home'
                            style={isActive(history, '/')}
                            size='large'
                        >
                            <HomeIcon />
                        </IconButton>
                    </Link>
                    <Link to='/shops/all'>
                        <Button style={isActive(history, '/shops/all')}>
                            All shops
                        </Button>
                    </Link>
                    <Link to='/auctions/all'>
                        <Button style={isActive(history, '/auctions/all')}>
                            All Auctions
                        </Button>
                    </Link>
                    <Link to='/cart'>
                        <Button style={isActive(history, '/cart')}>
                            Cart
                            <Badge
                                invisible={false}
                                color='secondary'
                                badgeContent={cart.itemTotal()}
                                style={{ marginLeft: '7px' }}
                            >
                                <CartIcon />
                            </Badge>
                        </Button>
                    </Link>
                </div>
                <div style={{ position: 'absolute', right: '10px' }}>
                    <span style={{ float: 'right' }}>
                        {!auth.isAuthenticated() && (
                            <span>
                                <Link to='/signup'>
                                    <Button
                                        style={isActive(history, '/signup')}
                                    >
                                        Sign up
                                    </Button>
                                </Link>
                                <Link to='/signin'>
                                    <Button
                                        style={isActive(history, '/signin')}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </span>
                        )}
                        {auth.isAuthenticated() && (
                            <span>
                                {auth.isAuthenticated().user.seller && (
                                    <>
                                        <Link to='/seller/shops'>
                                            <IconButton
                                                style={isPartActive(
                                                    history,
                                                    '/seller/',
                                                )}
                                            >
                                                <StoreIcon />
                                            </IconButton>
                                        </Link>
                                        <Link to='/myauctions'>
                                            <Button
                                                style={isPartActive(
                                                    history,
                                                    '/myauctions',
                                                )}
                                            >
                                                My Auctions
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                <Link
                                    to={
                                        '/user/' +
                                        auth.isAuthenticated().user._id
                                    }
                                >
                                    <IconButton
                                        style={isActive(
                                            history,
                                            '/user/' +
                                                auth.isAuthenticated().user._id,
                                        )}
                                    >
                                        <PeopleIcon />
                                    </IconButton>
                                </Link>
                                <Button
                                    color='inherit'
                                    onClick={() => {
                                        auth.clearJWT(() => navigate('/'))
                                    }}
                                >
                                    Sign out
                                </Button>
                            </span>
                        )}
                    </span>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Menu
