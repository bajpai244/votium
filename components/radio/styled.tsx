/** @format */

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export const Wrap = styled.div`
  font-family: 'Open Sans';
  & > h3 {
    margin: 0 0 24px 0;
  }
`;

export const Circle = styled(motion.div)`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 50%;
  box-sizing: border-box;
`;

export const Option = styled.li`
  display: flex;
  cursor: pointer;
`;

export const Container = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  outline: none;
  & > ${Option}:nth-child(n+2) {
    margin-top: 8px;
  }
  &:focus {
    #${(props) => props['aria-activedescendant']} > ${Circle} {
      box-shadow: 0 0 0 8px #f1f2f6;
    }
  }
`;
