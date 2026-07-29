const Card = ({ hover = true, className = '', children, ...props }) => {
  return (
    <div
      className={`card-ui ${hover ? 'card-ui--hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
