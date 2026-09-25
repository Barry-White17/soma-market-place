const config = {
    stripe_test_api_key:
        import.meta.env.STRIPE_TEST_API_KEY || 'YOUR_API_KEY///',
    stripe_connect_test_client_id:
        import.meta.env.STRIPE_CONNECT_TEST_CLIENT_ID ||
        'YOUR_STRIPE__CLIENT_ID',
    BACKEND_URL: import.meta.env.BACKEND_URL || 'https://soma-market-place-backend.vercel.app',
    SOCKET_URL: import.meta.env.SOCKET_URL || 'soma-market-place-backend.vercel.app',
}

export default config
