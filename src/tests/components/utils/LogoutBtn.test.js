import React from 'react';
import { shallow } from 'enzyme';
import { LogoutBtn } from '../../../components/utils/LogoutBtn';

test('should call startLogout on button click', () => {
  const startLogout = jest.fn();
  const auth = {status: 'login'};
  const wrapper = shallow(<LogoutBtn startLogout={startLogout} auth={auth}/>);
  wrapper.find('button').simulate('click');
  expect(startLogout).toHaveBeenCalled();
});

test('should show the button if user is not login', () => {
  const startLogout = jest.fn();
  const auth = {status: 'login'};
  const wrapper = shallow(<LogoutBtn startLogout={startLogout} auth={auth}/>);
  expect(wrapper).toMatchSnapshot();
})

test('should not show the button if user is not login', () => {
  const startLogout = jest.fn();
  const auth = {status: 'logout'};
  const wrapper = shallow(<LogoutBtn startLogout={startLogout} auth={auth}/>);
  expect(wrapper).toMatchSnapshot();
})
