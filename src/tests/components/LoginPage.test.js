import React from 'react';
import { shallow } from 'enzyme';
import { LoginPage } from '../../components/LoginPage';

test('should correctly render LoginPage', () => {
  const wrapper = shallow(<LoginPage auth={''}/>);
  expect(wrapper).toMatchSnapshot();
});

test('should call startLogin on button click', () => {
  const preventDefault = jest.fn();
  const startLogin = jest.fn();
  const wrapper = shallow(<LoginPage startLogin={startLogin} auth={''} />);
  wrapper.find('button').simulate('click', {preventDefault});
  expect(startLogin).toHaveBeenCalled();
});
