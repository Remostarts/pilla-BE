const cookieOptions = {
    // production_only
    sameSite: 'none' as const,
    // secure: configs.env === 'production',
    secure: true,
    httpOnly: true,
};

export { cookieOptions };
