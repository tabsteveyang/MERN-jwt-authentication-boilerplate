const defaultState = {
    status: 'logout'
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
          ...action.payload,
          status: 'login'
      };
    case 'LOGIN_ERROR':
      return {
          status: 'error'
      };
    case 'LOGOUT':
      return defaultState;
    default:
      return state;
  }
};
