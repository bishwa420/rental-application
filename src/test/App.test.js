import { render, screen } from '@testing-library/react';
import React from "react";
import App from '../App';
import {shallow, mount} from 'enzyme'

it("renders without crashing", () => {
  shallow(<App/>)
})
