import { useCallback, useEffect, useRef, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useStore } from '~/store';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/inputs';
import { Label } from '../label';

interface FilterOption {
  value: string;
  label: string;
}

const filterOptions: FilterOption[] = [
  { value: 'messages', label: 'Messages' },
  { value: 'tags', label: 'Tags' },
  { value: 'properties', label: 'Properties' },
  { value: 'statuses', label: 'Statuses' },
  { value: 'urls', label: 'Related URL' },
];
const ReportFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addFilter = useStore((state) => state.addFilter);
  const removeFilter = useStore((state) => state.removeFilter);
  const selectedFilters = useStore((state) => state.selectedFilters);

  const handleSelectValue = useCallback(
    (item: string) => {
      const label =
        filterOptions.find((opt) => opt.value === selectedFilter)?.label || '';
      const newFilter = { label, value: item };

      if (
        !selectedFilters.some(
          (filter) => filter.value === item && filter.label === label,
        )
      ) {
        addFilter(newFilter);
        setInputValue('');
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
    },
    [selectedFilter, selectedFilters, addFilter],
  );

  const filteredOptions = ['Item 1', 'Item 2', 'Item 3'].filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const selectedLabel =
    filterOptions.find((opt) => opt.value === selectedFilter)?.label || '';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (filteredOptions.length === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % filteredOptions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(
          (prev) =>
            (prev - 1 + filteredOptions.length) % filteredOptions.length,
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex !== -1) {
          handleSelectValue(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };
  useEffect(() => {
    if (showDropdown && focusedIndex !== -1 && dropdownRef.current) {
      dropdownRef.current
        .querySelectorAll('[role="option"]')
        [focusedIndex]?.scrollIntoView({
          block: 'nearest',
        });
    }
  }, [focusedIndex, showDropdown]);

  const handleFocus = () => {
    setShowDropdown(true);
    setFocusedIndex(0);
  };

  return (
    <div className="flex min-h-80 flex-col justify-between gap-6">
      <div>
        <Label htmlFor="filter-type">Filter By:</Label>
        <div className="flex flex-col gap-6 md:flex-row">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger
              id="filter-type"
              className="h-12 md:w-2/4"
              aria-label="Select Filter Type"
            >
              <SelectValue>{selectedLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full">
            <Input
              aria-label={`Search ${selectedLabel}`}
              type="text"
              className="h-12"
              placeholder={`Search ${selectedLabel}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleFocus}
            />
            {showDropdown && (
              <div
                aria-expanded="true"
                ref={dropdownRef}
                onKeyDown={handleKeyDown}
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1  shadow-lg"
              >
                {filteredOptions.map((item, index) => (
                  <div
                    key={index}
                    role="option"
                    aria-selected={index === focusedIndex}
                    className={`cursor-pointer rounded-sm p-2 ${index === focusedIndex ? 'bg-[#e9ecef]' : 'hover:bg-[#e9ecef]'}`}
                    onClick={() => handleSelectValue(item)}
                  >
                    {item}
                  </div>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="p-2 text-gray-500">No items found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap gap-2 p-3">
        {selectedFilters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center rounded-full bg-[#005031] px-3 py-1 text-white"
          >
            <span role="status">{`${filter.label}: ${filter.value}`}</span>
            <Cross2Icon
              className="ml-2 h-4 w-4 cursor-pointer"
              aria-label={`Remove ${filter.label} filter`}
              onClick={() => removeFilter(filter)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportFilter;
