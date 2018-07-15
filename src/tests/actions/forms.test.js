import { changeStatus } from '../../actions/forms';

test('should change status attribute while the status is changed', () => {
    const status = 'newState';
    const action = changeStatus(status);
    expect(action).toEqual({
      type: 'CHANGE_STATUS',
      status
    });
});
