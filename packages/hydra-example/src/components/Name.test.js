import React from 'react'
import { mount } from 'enzyme'
import { Name } from './Name'

test('Can render', () => {
  const wrapper = mount(<Name name="ryan" />)

  expect(wrapper).toMatchSnapshot()
})
