import { useCallback, useState, type ChangeEvent, type FC } from 'react';
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
const SearchInput: FC<SearchInputProps> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const [lastExternalValue, setLastExternalValue] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onChange, SEARCH_DEBOUNCE_MS);

  // Adopt the value when it changes from outside (e.g. back/forward navigation, deep links).
  if (value !== lastExternalValue) {
    setLastExternalValue(value);
    setInputValue(value);
  }

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.currentTarget.value;
      setInputValue(next);
      debouncedOnChange(next);
    },
    [debouncedOnChange],
  );

  const handleClear = useCallback(() => {
    debouncedOnChange.cancel();
    setInputValue('');
    onChange('');
  }, [debouncedOnChange, onChange]);

  return (
    <TextInput
      w={320}
      value={inputValue}
      onChange={handleChange}
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
