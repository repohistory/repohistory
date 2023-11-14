export default function Shade1() {
  return (
    <div className="absolute left-1/2 top-0 w-full -translate-x-1/2 transform">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1366"
        height="910"
        fill="none"
        viewBox="0 300 1366 910"
      >
        <g filter="url(#filter0_f_39_2)">
          <ellipse
            cx="683"
            cy="455"
            fill="url(#paint0_linear_39_2)"
            fillOpacity="0.4"
            rx="583"
            ry="355"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_39_2"
            width="1366"
            height="910"
            x="0"
            y="0"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_39_2"
              stdDeviation="100"
            />
          </filter>
          <linearGradient
            id="paint0_linear_39_2"
            x1="683"
            x2="683"
            y1="100"
            y2="810"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#62C3F8" />
            <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
