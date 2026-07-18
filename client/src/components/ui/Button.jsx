const variants = {
  primary: 'btn-ui btn-ui--primary',
  outline: 'btn-ui btn-ui--outline',
  ghost: 'btn-ui btn-ui--ghost',
  danger: 'btn-ui btn-ui--danger',
};

const sizes = {
  sm: 'btn-ui--sm',
  md: 'btn-ui--md',
  lg: 'btn-ui--lg',
};

const Button = ({ variant = 'primary', size = 'md', children, loading, disabled, className = '', ...props }) => {
  const cls = `${variants[variant]} ${sizes[size]} ${loading ? 'btn-ui--loading' : ''} ${className}`.trim();

  return (
    <button
      className={cls}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-ui__spinner" aria-hidden="true" />}
      <span className={loading ? 'btn-ui__text--hidden' : ''}>{children}</span>
    </button>
  );
};

export default Button;
