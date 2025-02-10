'use client'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';

const DatePickerWrapper = styled.div`
  width: 100%;
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
    margin-top: 4px;
  }

  input {
    width: 100%;
    height: 45px;
    background-color: var(--background-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    padding: 0 1rem;

    &:focus {
      border-color: var(--border-focused);
      outline: none;
    }
  }

  @keyframes fadeInBlue {
    from {
      opacity: 0;
      transform: translateY(-10px);
      box-shadow: 0 0 0 rgba(59, 130, 246, 0);
    }
    to {
      opacity: 1;
      transform: translateY(0);
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    }
  }

  .react-datepicker {
    background-color: var(--background-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-primary);
    transform-origin: top center;
    animation: fadeInBlue 0.3s ease-out;
  }

  .react-datepicker-popper {
  
  }

  .react-datepicker__header {
    background-color: var(--background-secondary);
    border-bottom: 1px solid var(--border-primary);
  }

  .react-datepicker__current-month {
    color: var(--text-primary);
    font-weight: 600;
  }

  .react-datepicker__day-name {
    color: var(--text-secondary);
  }

  .react-datepicker__day {
    color: var(--text-primary);
    transition: all 0.2s;

    &:hover {
      background-color: var(--button-primary);
      color: white;
      border-radius: 50%;
    }

    &--selected {
      background-color: var(--button-primary) !important;
      color: white;
      border-radius: 50%;

      &:hover {
        background-color: var(--button-primary-hover) !important;
      }
    }

    &--keyboard-selected {
      background-color: var(--active-bg);
      border-radius: 50%;
    }

    &--today {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background-color: var(--button-primary);
        border-radius: 50%;
      }
    }
  }

  .react-datepicker__day--disabled {
    color: var(--text-muted);
    &:hover {
      background-color: transparent;
    }
  }

  .react-datepicker__navigation-icon::before {
    border-color: var(--text-secondary);
    transition: border-color 0.2s;
  }

  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: var(--button-primary);
  }

  .react-datepicker__year-dropdown {
    background-color: var(--background-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    width: 120px;
    max-height: 300px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: var(--background-tertiary);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--button-primary);
      border-radius: 3px;
    }
  }

  .react-datepicker__year-option {
    padding: 0.5rem;
    color: var(--text-primary);
    transition: all 0.2s;
    
    &:hover {
      background-color: var(--button-primary);
      color: white;
    }

    &--selected {
      background-color: var(--active-bg);
      color: var(--button-primary);
      font-weight: bold;
    }
  }

  .react-datepicker__year-read-view {
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    background: var(--active-bg);

    &:hover {
      background: var(--active-hover);
    }

    &--down-arrow {
      border-color: var(--button-primary);
      border-width: 2px 2px 0 0;
      margin-left: 0.5rem;
    }

    &--selected-year {
      color: var(--button-primary);
      font-weight: 600;
    }
  }
`;

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;    
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: boolean;
}

const CustomDatePicker = ({
  selectedDate,
  onChange,
  placeholder = "Select date",
  className = "",
  required = false,
  error = false
}: CustomDatePickerProps) => {
  return (
    <DatePickerWrapper>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        className={`${className} ${error ? '' : ''}`}
        placeholderText={placeholder}
        dateFormat="dd-MM-yyyy"
        required={required}
        showPopperArrow={false}

        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
      />
    </DatePickerWrapper>
  );
};

export default CustomDatePicker;
