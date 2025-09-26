const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div
            className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}
          ></div>
          <p className={`text-gray-600 font-medium ${textSizes[size]}`}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-2 ${sizeClasses[size]}`}
        ></div>
        <p className={`text-gray-600 font-medium ${textSizes[size]}`}>{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
