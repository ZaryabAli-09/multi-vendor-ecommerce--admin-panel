export function Button({
  children,
  onClick,
  type = "button",
  variant = "outline",
  disabled = false,
  className = "", // New prop for custom classes
}) {
  const baseStyles =
    "px-4 py-2 font-medium text-sm rounded-md focus:outline-none transition-all ease-in-out duration-200";

  const variants = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-1",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:ring-offset-1",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-400 focus:ring-offset-1",
    outline:
      "border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:ring-2 focus:ring-slate-300 focus:ring-offset-1", // Outline with soft colors
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className} `}
    >
      {children}
    </button>
  );
}
