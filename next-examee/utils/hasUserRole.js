const hasUserRole = (...requiredRoles) => {
    if (typeof window === 'undefined') return false;
    const userRole = localStorage.getItem('userRole')?.toLowerCase();
    return requiredRoles?.some(role => userRole === role.toLowerCase());
}

export default hasUserRole;
