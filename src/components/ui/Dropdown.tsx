import { useState } from "react";

interface DropdownProps {
  options: number[];
  selectedOption: number;
  onOptionSelect: (option: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedOption,
  onOptionSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionSelect = (option: number) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  const sortedOptions = options.slice().sort((a, b) => a - b);

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        {selectedOption}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {sortedOptions.map((option) => (
            <li
              key={option}
              className="dropdown-item"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
