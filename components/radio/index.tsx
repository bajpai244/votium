/** @format */

import React, { useState, MouseEvent, KeyboardEvent, forwardRef } from 'react';
import { ForwardRefComponent, Variants } from 'framer-motion';

import { Circle, Option, Wrap } from './styled';
import { Flex, Box, Container } from 'theme-ui';

const keyCodes = {
  arrowLeft: 37,
  arrowUp: 38,
  arrowRight: 39,
  arrowDown: 40,
  space: 32,
};

const variants: Variants = {
  initial: {
    border: '2px solid #CED6E0',
    transition: {
      duration: 0.1,
    },
  },
  selected: {
    border: '6px solid #3B3B98',
    transition: {
      duration: 0.1,
    },
  },
};

interface Option {
  key: string;
  value: string;
  id?: string;
}

interface Props {
  id: string;
  label: string;
  options: Option[];
  value: Option['value'];
  onChange(value: Option['value']): void;
}

export const Radio: ForwardRefComponent<HTMLInputElement, Props> = forwardRef(
  ({ id, label, options, value, onChange }, ref) => {
    const [focusId, setFocusId] = useState('');

    const optionsWithIds = options.map((option) => {
      const clone = { ...option };
      clone.id = clone.id || `radio-option-${id}-${option.value}`;
      return clone;
    });

    const selectedOption = optionsWithIds.find(
      (option) => option.value === value
    );

    const selectedId = selectedOption ? selectedOption.id : '';

    function handleInitialContainerFocus() {
      if (!focusId) {
        if (typeof optionsWithIds[0].id === 'string') {
          setFocusId(optionsWithIds[0].id);
        }
      }
    }

    function handleOptionClick(option: Option) {
      return (event: MouseEvent) => {
        if (typeof option.id === 'string') {
          setFocusId(option.id);
        }
        onChange(option.value);
      };
    }

    function handleContainerKeyPress(event: KeyboardEvent) {
      switch (event.keyCode) {
        case keyCodes.arrowLeft:
        case keyCodes.arrowUp: {
          event.preventDefault();
          const previousOptionIndex =
            optionsWithIds.findIndex((option) => option.id === focusId) - 1;
          if (previousOptionIndex >= 0) {
            const previousOption = optionsWithIds[previousOptionIndex];
            onChange(previousOption.value);
            if (typeof previousOption.id === 'string') {
              setFocusId(previousOption.id);
            }
          }
          break;
        }
        case keyCodes.arrowDown:
        case keyCodes.arrowRight: {
          event.preventDefault();
          const nextOptionIndex =
            optionsWithIds.findIndex((option) => option.id === focusId) + 1;
          if (nextOptionIndex < optionsWithIds.length) {
            const nextOption = optionsWithIds[nextOptionIndex];
            onChange(nextOption.value);
            if (typeof nextOption.id === 'string') {
              setFocusId(nextOption.id);
            }
          }
          break;
        }
        case keyCodes.space: {
          event.preventDefault();
          if (!value) {
            onChange(optionsWithIds[0].value);
          }
          break;
        }
        default:
          break;
      }
    }

    function renderOptions() {
      return optionsWithIds.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <Box
            key={option.id}
            sx={{ mx: [3], mt: [3], width: [200, 150, 130, 120] }}
          >
            <Option
              id={option.id}
              role="radio"
              aria-checked={isSelected}
              onClick={handleOptionClick(option)}
            >
              <Circle
                variants={variants}
                initial="initial"
                animate={isSelected ? 'selected' : 'initial'}
              />
              {option.key}
            </Option>
          </Box>
        );
      });
    }

    const labelId = `radio-label-${id}`;

    return (
      <Container>
        <h3 id={labelId}>{label}</h3>
        <Flex
          tabIndex={0}
          role="radiogroup"
          aria-labelledby={labelId}
          aria-activedescendant={focusId}
          onFocus={handleInitialContainerFocus}
          onKeyDown={handleContainerKeyPress}
          sx={{ justifyContent: 'center', mx: [4], flexWrap: 'wrap' }}
        >
          {renderOptions()}
        </Flex>
      </Container>
    );
  }
);

Radio.displayName = 'Radio';
export default Radio;
