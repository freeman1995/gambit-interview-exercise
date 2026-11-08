import { useState } from 'react';
import { CloseButton, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';

import { SEARCH_DEBOUNCE_MS } from '../../constants/tableConstants.ts';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Text input that updates immediately but reports changes to the parent debounced. */
const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [lastExternalValue, setLastExternalValue] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onChange, SEARCH_DEBOUNCE_MS);

  // Adopt the value when it changes from outside (e.g. back/forward navigation, deep links).
  if (value !== lastExternalValue) {
    setLastExternalValue(value);
    setInputValue(value);
  }

  const handleChange = (next: string) => {
    setInputValue(next);
    debouncedOnChange(next);
  };

  const handleClear = () => {
    debouncedOnChange.cancel();
    setInputValue('');
    onChange('');
  };

  return (
    <TextInput
      w={320}
      value={inputValue}
      onChange={(event) => handleChange(event.currentTarget.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      leftSection={<IconSearch size={16} />}
      rightSection={
        inputValue ? (
          <CloseButton size="sm" aria-label="Clear search" onClick={handleClear} />
        ) : null
      }
    />
  );
};

export default SearchInput;
