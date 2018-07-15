import React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from '../../components/Navbar';

test('should render Navbar correctly', () => {
  const wrapper = shallow(<Navbar />);
  expect(wrapper).toMatchSnapshot();
});

//test('should call startLogout on button click', () => {
//  const startLogout = jest.fn();
//  const wrapper = shallow(<Header startLogout={startLogout} />);
//  wrapper.find('button').simulate('click');
//  expect(startLogout).toHaveBeenCalled();
//});
