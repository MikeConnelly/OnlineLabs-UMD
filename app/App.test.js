import React from 'react';
// import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import App from './App';

describe('Test Suite', () => {
  it('app test', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state.loggedIn.toEqual(false));
  });
});
