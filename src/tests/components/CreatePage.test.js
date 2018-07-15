import React from 'react';
import { shallow } from 'enzyme';
import { CreatePage } from '../../components/CreatePage';

test('should correctly render CreatePage', () => {
  const startCreateUser = jest.fn();
  const changeStatus = jest.fn();
  const form = {editStatus: 'clean'};
  const wrapper = shallow(<CreatePage form={form} startCreateUser={startCreateUser} changeStatus={changeStatus}/>);
  expect(wrapper).toMatchSnapshot();
});

test('should change state when input value is changed', () => {
  const startCreateUser = jest.fn();
  const changeStatus = jest.fn();
  const form = {editStatus: 'clean'};
  const wrapper = shallow(<CreatePage form={form} startCreateUser={startCreateUser} changeStatus={changeStatus}/>);
  wrapper.find('input').at(0).simulate('change', {target: {value: 'value'}});
  expect(changeStatus).toHaveBeenCalled();
});

test('should submit on button click', () => {
  const preventDefault = jest.fn();
  const startCreateUser = jest.fn();
  const changeStatus = jest.fn();
  const form = {editStatus: 'clean'};
  const wrapper = shallow(<CreatePage form={form} startCreateUser={startCreateUser} changeStatus={changeStatus}/>);
  wrapper.find('button').simulate('click', {preventDefault});
  expect(startCreateUser).toHaveBeenCalled();
});
