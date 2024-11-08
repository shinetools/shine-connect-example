import React from 'react';

function ScopeList({ values, selectedValues, onSelectedValuesChange }) {
  const handleCheckboxChange = (value: string) => {
    const updatedSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item: string) => item !== value)
      : [...selectedValues, value];

    onSelectedValuesChange(updatedSelectedValues);
  };

  return (
    <div>
      {values.map((value: string, index: number) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            value={value}
            checked={selectedValues.includes(value)}
            onChange={() => handleCheckboxChange(value)}
          />
          <label htmlFor={`checkbox-${index}`}>{value}</label>
        </div>
      ))}
    </div>
  );
}

export default ScopeList;
