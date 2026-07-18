import SkeletonLoad from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Skeleton = ({ count = 1, height, width, circle, className = '', ...props }) => {
  return (
    <SkeletonLoad
      count={count}
      height={height}
      width={width}
      circle={circle}
      className={className}
      baseColor="#e2e5ea"
      highlightColor="#f0f2f5"
      {...props}
    />
  );
};

export default Skeleton;
