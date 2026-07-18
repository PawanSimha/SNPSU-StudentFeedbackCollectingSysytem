const Badge = ({ variant = 'default', className = '', children }) => {
  const variants = {
    default: 'badge-ui badge-ui--default',
    primary: 'badge-ui badge-ui--primary',
    success: 'badge-ui badge-ui--success',
    warning: 'badge-ui badge-ui--warning',
  };

  return (
    <span className={`${variants[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
};

export default Badge;
