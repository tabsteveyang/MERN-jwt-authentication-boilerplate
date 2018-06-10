const defaultState = {
    editStatus: 'clean'  //clean | dirty | error | success
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'CHANGE_STATUS':
      return {
        editStatus: action.status
      };
    default:
      return state;
  }
};
