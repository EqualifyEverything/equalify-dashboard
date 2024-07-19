import { useCallback, useEffect, useRef, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/inputs';
import { filtersQuery } from '~/queries/filters';
import { FilterOption, FiltersResponse } from '~/services/filters';
import { useStore } from '~/store';
import { Label } from '../label';

interface ReportFilterProps {
  defaultFilters: FilterOption[];
  onChange: (event: { target: { name: string; value: string } }) => void;
}

const ReportFilter: React.FC<ReportFilterProps> = ({ defaultFilters = [], onChange }) => {
  const { data: filterData } = useQuery(filtersQuery());
  const [selectedFilter, setSelectedFilter] =
    useState<keyof FiltersResponse>('messages');
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const addFilter = useStore((state) => state.addFilter);
  const removeFilter = useStore((state) => state.removeFilter);
  const clearFilters = useStore((state) => state.clearFilters);
  const selectedFilters = useStore((state) => state.selectedFilters);

  useEffect(() => {
    for (const defaultFilter of defaultFilters) {
      addFilter(defaultFilter);
    }
  }, [defaultFilters, addFilter]);

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, [location.pathname, clearFilters]);

  const handleSelectValue = useCallback(
    (item: string) => {
      const filterOption = filterData?.[selectedFilter]?.find(
        (opt: FilterOption) => opt.value === item,
      );
      if (!filterOption) return;

      const { type, label } = filterOption;
      const newFilter = { type, label, value: item };

      if (
        !selectedFilters.some(
          (filter) => filter.value === item && filter.type === type,
        )
      ) {
        addFilter(newFilter);
        setInputValue('');
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
      onChange({ target: { name: 'filters', value: JSON.stringify(selectedFilters) } });
    },
    [selectedFilter, selectedFilters, addFilter, filterData, onChange],
  );

  const filteredOptions =
    filterData?.[selectedFilter]?.filter((item: FilterOption) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    ) || [];

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
          handleSelectValue(filteredOptions[focusedIndex].value);
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
          <Select
            value={selectedFilter}
            onValueChange={(value) =>
              setSelectedFilter(value as keyof FiltersResponse)
            }
          >
            <SelectTrigger
              id="filter-type"
              className="h-12 md:w-2/4"
              aria-label="Select Filter Type"
            >
              <SelectValue>
                {selectedFilter.charAt(0).toUpperCase() +
                  selectedFilter.slice(1)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {filterData &&
                Object.keys(filterData).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="relative w-full">
            <Input
              aria-label={`Search ${selectedFilter}`}
              type="text"
              className="h-12"
              placeholder={`Search ${selectedFilter}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
            />
            {showDropdown && (
              <div
                aria-expanded="true"
                ref={dropdownRef}
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1  shadow-lg"
              >
                {filteredOptions.map((item, index) => (
                  <div
                    key={index}
                    role="option"
                    aria-selected={index === focusedIndex}
                    className={`cursor-pointer rounded-sm p-2 ${index === focusedIndex ? 'bg-[#e9ecef]' : 'hover:bg-[#e9ecef]'}`}
                    onClick={() => handleSelectValue(item.value)}
                  >
                    {item.label}
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
            <span role="status" className='truncate max-w-[150px] sm:max-w-[200px]'>{`${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}: ${filter.label}`}</span>
            <Cross2Icon
              className="ml-2 h-4 w-4 cursor-pointer"
              aria-label={`Remove ${filter.label} filter`}
              onClick={() => removeFilter(filter)}
            />
          </div>
        ))}
      </div>
      <input type='text' hidden name='filters' value={JSON.stringify(selectedFilters)} />
    </div>
  );
};

export default ReportFilter;
