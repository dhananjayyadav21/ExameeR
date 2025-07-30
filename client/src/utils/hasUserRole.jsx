const hasUserRole = (...requiredRoles) => {
  const userRole = localStorage?.getItem('userRole');

  return requiredRoles?.some(role => userRole?.includes(role));
}
  
export default hasUserRole;
  