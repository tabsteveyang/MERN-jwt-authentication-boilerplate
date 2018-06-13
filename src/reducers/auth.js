const defaultState = {
    status: ''
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
      return {
          status: 'logout'
      };
    default:
      return state;
  }
};
