import { login, logout } from '../../actions/auth';

test('should generate login action object with payload', () => {
    const payload = {
    };
    const action = login(payload);
    expect(action).toEqual({
      type: 'LOGIN',
      payload
    });
});

test('should generate logout action object', () => {
    const action = logout();
    expect(action).toEqual({
      type: 'LOGOUT'
    });
});
