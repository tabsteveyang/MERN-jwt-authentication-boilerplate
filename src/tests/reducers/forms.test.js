import formReducer from '../../reducers/forms';

test('should change status while the status has chanded', () => {
  const action = {
    type: 'CHANGE_STATUS',
    status: 'dirty'
  };
  const state = formReducer({editStatus: 'clean'}, action);
  expect(state.editStatus).toEqual('dirty');
});
