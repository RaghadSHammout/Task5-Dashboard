interface MainBtnProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string; 
}

export default function MainBtn({ text, onClick, type = "button", className = "" }: MainBtnProps) {
  const isFullWidth = className.includes("full-width");

  return (
    <div className={isFullWidth ? "d-flex justify-content-center" : ""}>
      <button
        type={type}
        onClick={onClick}
        className={`text-light border-0 px-4 py-2 ${isFullWidth ? "w-100" : ""} ${className}`}
        style={{ backgroundColor: "#FFC107", borderRadius: "4px" }}
      >
        {text}
      </button>
    </div>
  );
}
