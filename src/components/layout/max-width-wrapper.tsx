interface MaxWidthWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className="mx-auto h-full w-full max-w-screen-xl px-5 lg:px-20">
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
