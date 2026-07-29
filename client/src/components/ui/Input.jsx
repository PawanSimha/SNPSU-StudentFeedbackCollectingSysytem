import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`input-ui ${error ? 'input-ui--error' : ''} ${className}`}>
      <input
        ref={ref}
        id={inputId}
        className="input-ui__field"
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {label && (
        <label htmlFor={inputId} className="input-ui__label">
          {label}
        </label>
      )}
      {error && (
        <p id={`${inputId}-error`} className="input-ui__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
