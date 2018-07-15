import authReducer from '../../reducers/auth';

test("should set payload and set status as 'login' when login", () => {
  const action = {
    type: 'LOGIN',
    payload: {data: 'value'}
  };
  const state = authReducer({}, action);
  expect(state.status).toEqual('login');
  expect(state.data).toEqual('value');
});

test("should set status as 'logout' and clear other attributes when logout", () => {
  const action = {
    type: 'LOGOUT'
  };
  const state = authReducer({ data: 'anyvalue', status: 'login' }, action);
  expect(state).toEqual({status: 'logout'});
});

test("should set status to 'error' and clear other attributes when error occure", () => {
  const action = {
    type: 'LOGOUT_ERROR'
  };
  const state = authReducer({ status: 'error' }, action);
  expect(state).toEqual({status: 'error'});
});
