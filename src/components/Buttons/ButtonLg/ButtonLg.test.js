import React from 'react';
import Enzyme, {shallow} from 'enzyme'; 
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {findByTestAttr, storeFactory} from '../../../test/testUtils';
import ButtonLg from './ButtonLg';

Enzyme.configure({adapter: new EnzymeAdapter});
const setup = (initialState={}) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<ButtonLg store={store}/>).dive();
    return wrapper;
}
describe('game has been setup', ()=>{
    let wrapper;
    beforeEach(()=>{
        const initialState = { gameActive: true}
        wrapper = setup(initialState);
    })
    test('renders component without error', ()=>{
        const component = findByTestAttr(wrapper, "component-button");
        expect(component.length).toBe(1);
    });
}); 
