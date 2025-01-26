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
    margin-top:4px
  }

  input {
    width: 100%;
    height: 45px;
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
    background-color: #111111;
    border: 1px solid #374151;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(255, 0, 0, 0.5);
    transform-origin: top center;
    animation: fadeInBlue 0.3s ease-out;
  }

  .react-datepicker-popper {
  
  }

  .react-datepicker__header {
    background-color: #111111;
    border-bottom: 1px solid #374151;
  }

  .react-datepicker__current-month {
    color: #F3F4F6;
    font-weight: 600;
  }

  .react-datepicker__day-name {
    color: #9CA3AF;
  }

  .react-datepicker__day {
    color: #F3F4F6;
    transition: all 0.2s;

    &:hover {
      background-color: #EC4899;
      color: white;
      border-radius: 50%;
    }

    &--selected {
      background-color: #EC4899 !important;
      color: white;
      border-radius: 50%;

      &:hover {
        background-color: #BE185D !important;
      }
    }

    &--keyboard-selected {
      background-color: rgba(236, 72, 153, 0.2);
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
        background-color: #EC4899;
        border-radius: 50%;
      }
    }
  }

  .react-datepicker__day--disabled {
    color: #4B5563;
    &:hover {
      background-color: transparent;
    }
  }

  .react-datepicker__navigation-icon::before {
    border-color: #9CA3AF;
    transition: border-color 0.2s;
  }

  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #EC4899;
  }

  /* Year Dropdown Styling */
  .react-datepicker__year-dropdown {
    background-color: #111111;
    border: 1px solid #374151;
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    width: 120px;
    max-height: 300px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #1F2937;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #EC4899;
      border-radius: 3px;
    }
  }

  .react-datepicker__year-option {
    padding: 0.5rem;
    color: #F3F4F6;
    transition: all 0.2s;
    
    &:hover {
      background-color: #EC4899;
      color: white;
    }

    &--selected {
      background-color: rgba(236, 72, 153, 0.2);
      color: #EC4899;
      font-weight: bold;
    }
  }

  /* Year Read View Styling */
  .react-datepicker__year-read-view {
    color: #F3F4F6;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    background: rgba(236, 72, 153, 0.1);

    &:hover {
      background: rgba(236, 72, 153, 0.2);
    }

    &--down-arrow {
      border-color: #EC4899;
      border-width: 2px 2px 0 0;
      margin-left: 0.5rem;
    }

    &--selected-year {
      color: #EC4899;
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
