import React from 'react';
import { shallow } from 'enzyme';
import NotAllowPage from '../../components/NotAllowPage';

test('should render NotAllowPage correctly', () => {
  const wrapper = shallow(<NotAllowPage />);
  expect(wrapper).toMatchSnapshot();
});
