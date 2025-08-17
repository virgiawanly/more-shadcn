'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDownIcon, Loader2, X } from 'lucide-react';
import * as React from 'react';

export interface AsyncSelectOption {
  label: string;
  value: string;
  [key: string]: any;
}

export interface AsyncSelectProps<T extends AsyncSelectOption> {
  /**
   * Function to fetch options asynchronously
   */
  fetcher: (inputValue: string) => Promise<T[]>;
  /**
   * Function to render each option
   */
  renderOption?: (option: T) => React.ReactNode;
  /**
   * Function to get the display value for selected option
   */
  getDisplayValue?: (option: T) => string;
  /**
   * Function to get the option value
   */
  getOptionValue?: (option: T) => string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Selected value
   */
  value?: string | null;
  /**
   * Callback when value changes
   */
  onChange?: (value: string | undefined | null, option: T | undefined | null) => void;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Custom className for the trigger button
   */
  className?: string;
  /**
   * Size of the select trigger
   */
  size?: 'sm' | 'default';
  /**
   * Whether to allow clearing the selection
   */
  clearable?: boolean;

  /**
   * Minimum characters to trigger search
   */
  minSearchLength?: number;
  /**
   * Loading text
   */
  loadingText?: string;
  /**
   * No results text
   */
  noResultsText?: string;
  /**
   * Error text when fetch fails
   */
  errorText?: string;
}

export function AsyncSelect<T extends AsyncSelectOption>({
  fetcher,
  renderOption,
  getDisplayValue = (option: T) => option.label,
  getOptionValue = (option: T) => option.value,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  value,
  onChange,
  disabled = false,
  className,
  size = 'default',
  clearable = true,
  minSearchLength = 0,
  loadingText = 'Loading...',
  noResultsText = 'No results found',
  errorText = 'Failed to load options',
}: AsyncSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState<T | undefined>();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Find selected option from current options or keep previous one
  React.useEffect(() => {
    if (value) {
      const found = options.find((option) => getOptionValue(option) === value);
      if (found) {
        setSelectedOption(found);
      }
    } else {
      setSelectedOption(undefined);
    }
  }, [value, options, getOptionValue]);

  // Fetch options when search value changes
  React.useEffect(() => {
    if (open) {
      if (searchValue.length >= minSearchLength) {
        fetchOptions(searchValue);
      } else if (searchValue.length === 0) {
        fetchOptions('');
      }
    }
  }, [searchValue, minSearchLength, open]);

  // Initial fetch when component opens
  React.useEffect(() => {
    if (open && options.length === 0 && !loading) {
      fetchOptions('');
    }
  }, [open]);

  const fetchOptions = async (search: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetcher(search);
      setOptions(results);
    } catch (err) {
      setError(errorText);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option: T) => {
    const optionValue = getOptionValue(option);
    setSelectedOption(option);
    onChange?.(optionValue, option);
    setOpen(false);
    // Don't clear search value immediately, let it clear when popover closes
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOption(undefined);
    onChange?.(undefined, undefined);
  };

  const displayValue = selectedOption ? getDisplayValue(selectedOption) : placeholder;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Clear search when popover closes
      setSearchValue('');
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          data-size={size}
          className={cn(
            "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            !selectedOption && 'text-muted-foreground',
            className
          )}
        >
          <span className="truncate line-clamp-1 flex items-center gap-2">{displayValue}</span>
          <div className="flex items-center gap-1">
            {clearable && selectedOption && (
              <span
                onClick={handleClear}
                className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                role="button"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </span>
            )}
            <ChevronDownIcon className="size-4 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md p-1"
        sideOffset={4}
        align="start"
        style={{
          width: triggerRef.current?.offsetWidth,
        }}
      >
        <Command shouldFilter={false} className="gap-y-1">
          <CommandInput placeholder={searchPlaceholder} value={searchValue} onValueChange={setSearchValue} />
          <CommandList>
            {loading && (
              <CommandEmpty>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {loadingText}
                </div>
              </CommandEmpty>
            )}

            {!loading && error && <CommandEmpty>{error}</CommandEmpty>}

            {!loading && !error && options.length === 0 && <CommandEmpty>{noResultsText}</CommandEmpty>}

            {!loading &&
              !error &&
              options.map((option) => {
                const optionValue = getOptionValue(option);
                const isSelected = value === optionValue;

                return (
                  <CommandItem key={optionValue} onSelect={() => handleSelect(option)} className="cursor-pointer relative pr-8">
                    {renderOption ? renderOption(option) : getDisplayValue(option)}
                    <span className="absolute right-2 flex size-3.5 items-center justify-center">
                      <Check className={cn('h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                    </span>
                  </CommandItem>
                );
              })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default AsyncSelect;
