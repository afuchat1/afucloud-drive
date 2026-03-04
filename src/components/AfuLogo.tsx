const AfuLogo = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Cloud shape */}
    <path
      d="M32 22a6 6 0 0 0-5.65-5.99A8 8 0 0 0 11 18a6 6 0 0 0 1 11.94h18A6 6 0 0 0 32 22Z"
      className="fill-foreground"
    />
    {/* Accent arrow / upload indicator */}
    <path
      d="M20 12v8M16.5 15.5 20 12l3.5 3.5"
      stroke="hsl(24, 95%, 53%)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AfuLogo;
