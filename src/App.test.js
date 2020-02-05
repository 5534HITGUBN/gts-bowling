import React from 'react';
// import ReactDOM from 'react-dom';
import Enzyme, {shallow} from 'enzyme'; 
import EnzymeAdapter from 'enzyme-adapter-react-16';
import App from './App';

Enzyme.configure({adapter: new EnzymeAdapter});

test('renders without error',()=>{
  const wrapper = shallow(<App/>);
  const appComponent = wrapper.find("[data-test='component-app']");
  expect(appComponent.length).toBe(1);
});

