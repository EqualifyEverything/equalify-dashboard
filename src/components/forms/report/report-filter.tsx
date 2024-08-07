import React, { useCallback, useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TypeAhead,
} from '~/components/inputs';
import { filtersQuery } from '~/queries/filters';
import { FilterOption, FiltersResponse } from '~/services/filters';
import { useStore } from '~/store';
import { Label } from '../label';

interface ReportFilterProps {
  defaultFilters: FilterOption[];
  onChange: (event: { target: { name: string; value: string } }) => void;
  onFilterChange: () => void;
  filterError?: string;
}

const ReportFilter: React.FC<ReportFilterProps> = ({
  defaultFilters = [],
  onChange,
  onFilterChange,
  filterError,
}) => {
  const { data: filterData } = useQuery(filtersQuery());
  const [selectedFilter, setSelectedFilter] =
    useState<keyof FiltersResponse | 'types'>('messages');
  const [removalMessage, setRemovalMessage] = useState<string | null>(null);
  const location = useLocation();

  const addFilter = useStore((state) => state.addFilter);
  const removeFilter = useStore((state) => state.removeFilter);
  const clearFilters = useStore((state) => state.clearFilters);
  const selectedFilters = useStore((state) => state.selectedFilters);

  const typeFilterValues = [
    { type: 'types', label: 'Violation', value: 'violation' },
    { type: 'types', label: 'Warning', value: 'warning' },
    { type: 'types', label: 'Error', value: 'error' },
  ];

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
    (value: string) => {
      const filterOption =
        selectedFilter === 'types'
          ? typeFilterValues.find((opt) => opt.label === value)
          : filterData?.[selectedFilter]?.find((opt: FilterOption) => opt.label === value);
      if (!filterOption) return;
      const { type, label, value: id } = filterOption;
      const newFilter = { type, label, value: id };

      if (
        !selectedFilters.some(
          (filter) => filter.value === value && filter.type === type,
        )
      ) {
        addFilter(newFilter);
        onChange({
          target: { name: 'filters', value: JSON.stringify(selectedFilters) },
        });
        onFilterChange(); 
      }
    },
    [selectedFilter, selectedFilters, addFilter, filterData, typeFilterValues, onChange, onFilterChange],
  );

  const handleRemoveFilter = useCallback(
    (filter: FilterOption) => {
      removeFilter(filter);
      onFilterChange();  

      setRemovalMessage(`Removed ${filter.label} filter`);
      setTimeout(() => setRemovalMessage(null), 3000);
    },
    [removeFilter, selectedFilters, onFilterChange]
  );

  const suggestions =
    selectedFilter === 'types'
      ? typeFilterValues.map((item) => item.label)
      : filterData?.[selectedFilter]?.map((item: FilterOption) => item.label) || [];

      const hasPropertyFilter = selectedFilters.some((filter) => filter.type === 'properties');

  useEffect(() => {
    if (hasPropertyFilter) {
      setRemovalMessage(null);
    }
  }, [hasPropertyFilter]);

  return (
    <div className="flex min-h-80 flex-col justify-between gap-6">
      <div>
        <Label htmlFor="filter-type">Filter By:</Label>
        <div className="flex flex-col gap-6 md:flex-row">
          <Select
            value={selectedFilter}
            onValueChange={(value) =>
              setSelectedFilter(value as keyof FiltersResponse | 'properties')
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
              <SelectItem key="types" value="types">
                Types
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full">
            <TypeAhead
              inputId="search-box"
              onConfirm={handleSelectValue}
              suggestions={suggestions}
              selectedFilters={selectedFilters.map((filter) => filter.label)} // Pass selected filters
            />
          </div>
        </div>
        {filterError && !hasPropertyFilter && (
          <p className="mt-2 text-sm text-red-600">
            {filterError}
          </p>
        )}
      </div>
      <section aria-label="Selected Filters">
        <h2 className="sr-only">Selected Filters</h2>
        <div className="flex w-full flex-wrap gap-2 p-3">
          {selectedFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center rounded-full bg-[#005031] px-3 py-1 text-white"
              role="group"
              aria-label={`Filter: ${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}: ${filter.label}`}
              tabIndex={0}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  const button = document.getElementById(`remove-filter-${index}`);
                  button?.focus();
                }
              }}
            >
              <span
                role="status"
                className="max-w-[150px] truncate sm:max-w-[200px]"
                aria-label={`${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}: ${filter.label}`}
              >
                {`${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}: ${filter.label}`}
              </span>
              <button
                id={`remove-filter-${index}`}
                type="button"
                className="ml-2 h-4 w-4 cursor-pointer"
                aria-label={`Remove ${filter.label} filter`}
                onClick={() => handleRemoveFilter(filter)}
                onFocus={() => setRemovalMessage(`Focused on remove button for ${filter.label} filter`)}
              >
                <Cross2Icon />
              </button>
            </div>
          ))}
        </div>
      </section>
      <div className="sr-only" aria-live="assertive">
        {removalMessage}
      </div>
    </div>
  );
};


export default ReportFilter;
