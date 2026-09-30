export default function SquigglyLine() {
  return (
    <svg
      viewBox="0 0 92.8 12"
      className="w-full h-6 "   // <-- full width + bigger height
      preserveAspectRatio="none"  // <-- allows stretching horizontally
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes squiggle {
            to { stroke-dashoffset: -200; }
          }
        `}
      </style>

      <path
        d="M1.4,6c0,0,9-9,18,0s18,0,18,0s9-9,18,0s18,0,18,0s9-9,18,0"
        className="fill-none stroke-[#FFF41D]"
        style={{
          strokeWidth: 4,
          strokeMiterlimit: 10,
          strokeDasharray: 100,
          animation: "squiggle 5s linear infinite",
        }}
      />
    </svg>
  );
}
