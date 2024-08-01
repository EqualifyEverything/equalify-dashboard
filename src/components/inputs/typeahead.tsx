import React, { useState, useRef, useEffect, useReducer } from 'react';

interface TypeAheadProps {
  inputId: string;
  onConfirm: (value: string) => void;
  suggestions: string[];
  selectedFilters: string[];
}

// Debounce the typeahead
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Manage Typeahead component state
type State = {
  suggestions: string[];
  searchTerm: string;
  currentIndex: number;
  selectedSuggestion: string | null;
};

type Action =
  | { type: 'resetSuggestions' }
  | { type: 'setSearchTerm'; searchTerm: string }
  | { type: 'setSuggestions'; suggestions: string[] }
  | { type: 'setCurrentIndex'; currentIndex: number }
  | { type: 'setSelectedSuggestion'; selectedSuggestion: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'resetSuggestions':
      return {
        ...state,
        suggestions: [],
        currentIndex: -1,
        searchTerm: '',
        selectedSuggestion: null,
      };
    case 'setSearchTerm':
      return {
        ...state,
        searchTerm: action.searchTerm,
        selectedSuggestion: null,
      };
    case 'setSuggestions':
      return {
        ...state,
        suggestions: action.suggestions,
      };
    case 'setCurrentIndex':
      return {
        ...state,
        currentIndex: action.currentIndex,
      };
    case 'setSelectedSuggestion':
      return {
        ...state,
        selectedSuggestion: action.selectedSuggestion,
      };
    default:
      return state;
  }
}

export const TypeAhead: React.FC<TypeAheadProps> = ({
  inputId,
  onConfirm,
  suggestions,
  selectedFilters,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [state, dispatch] = useReducer(reducer, {
    suggestions: [],
    searchTerm: '',
    currentIndex: -1,
    selectedSuggestion: null,
  });

  const updateActiveDescendant = (index: number) => {
    if (index >= 0 && index < state.suggestions.length) {
      inputRef.current?.setAttribute('aria-activedescendant', `suggestion-${index}`);
    } else {
      inputRef.current?.removeAttribute('aria-activedescendant');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (state.currentIndex < state.suggestions.length - 1) {
          const currentIndex = state.currentIndex + 1;
          dispatch({ type: 'setCurrentIndex', currentIndex });
          updateActiveDescendant(currentIndex);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (state.currentIndex > 0) {
          const currentIndex = state.currentIndex - 1;
          dispatch({ type: 'setCurrentIndex', currentIndex });
          updateActiveDescendant(currentIndex);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (state.currentIndex !== -1) {
          handleSelectValue(state.suggestions[state.currentIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        dispatch({ type: 'resetSuggestions' });
        setIsFocused(false);
        break;
      case 'Tab':
        dispatch({ type: 'resetSuggestions' });
        setIsFocused(false);
        break;
      default:
        break;
    }
  };

  const handleSelectValue = (selectedValue: string) => {
    if (!selectedFilters.includes(selectedValue)) {
      onConfirm(selectedValue);
      dispatch({ type: 'resetSuggestions' });
      dispatch({ type: 'setSelectedSuggestion', selectedSuggestion: selectedValue });
      setIsFocused(true);
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const debounceInputChange = useDebounce(searchTerm, 250);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
        dispatch({ type: 'resetSuggestions' });
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, []);

  useEffect(() => {
    dispatch({ type: 'setSearchTerm', searchTerm: debounceInputChange });
  }, [debounceInputChange]);

  useEffect(() => {
    if (isFocused) {
      const filteredData = state.searchTerm
        ? suggestions.filter((data) =>
            data.toLowerCase().includes(state.searchTerm.toLowerCase())
          )
        : suggestions;

      dispatch({ type: 'setSuggestions', suggestions: filteredData });
    } else {
      dispatch({ type: 'resetSuggestions' });
    }
  }, [state.searchTerm, suggestions, isFocused]);

  useEffect(() => {
    if (state.currentIndex !== -1) {
      const activeItem = document.getElementById(`suggestion-${state.currentIndex}`);
      activeItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [state.currentIndex]);

  return (
    <div className="relative">
      <input
        id={inputId}
        ref={inputRef}
        role="combobox"
        aria-controls="suggestion-box"
        aria-haspopup="listbox"
        aria-autocomplete="list"
        autoComplete="off"
        aria-expanded={isFocused && state.suggestions.length > 0}
        type="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type to search"
        aria-describedby={`${inputId}-description`}
        className="w-full border focus:ring-1 focus:outline-none focus:ring-[#1D781D] rounded-md px-3 py-2 shadow-sm h-12"
      />
      <div id={`${inputId}-description`} className="sr-only">
        Search and browse filters then add multiple filters to reports.
      </div>
      {isFocused && state.suggestions.length > 0 && (
        <div
          className="absolute w-full mt-1 bg-white border rounded-md shadow-md p-1 max-h-60 overflow-auto"
          ref={suggestionBoxRef}
        >
          <ul id="suggestion-box" role="listbox">
            {state.suggestions.map((suggestion: string, index: number) => {
              const isSelected = selectedFilters.includes(suggestion);
              return (
                <li
                  key={index}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={index === state.currentIndex}
                  aria-disabled={isSelected}
                  className={`p-2 cursor-pointer rounded-sm py-1.5 pl-2 pr-8 text-sm ${
                    index === state.currentIndex ? 'bg-[#e9ecef]' : ''
                  } ${isSelected ? 'text-gray-400' : ''}`}
                  onMouseDown={() => !isSelected && handleSelectValue(suggestion)}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter' && !isSelected) {
                      handleSelectValue(suggestion);
                    }
                  }}
                >
                  {suggestion} {isSelected ? '(Already selected)' : ''}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {state.selectedSuggestion && (
        <div className="sr-only" aria-live="assertive">
          {`${state.selectedSuggestion} was added to Selected Filters. Type to search for additional filters. Use the arrow keys to select from results. Save your updates by clicking the Update Report button.`}
        </div>
      )}
    </div>
  );
};