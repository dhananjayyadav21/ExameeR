const hasUserRole = (...requiredRoles) => {
    if (typeof window === 'undefined') return false;
    const userRole = localStorage.getItem('userRole');
    return requiredRoles?.some(role => userRole?.includes(role));
}

export default hasUserRole;
