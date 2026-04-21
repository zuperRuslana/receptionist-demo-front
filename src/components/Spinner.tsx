interface SpinnerProps {
  size?: number
}

const Spinner = ({ size = 12 }: SpinnerProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    className="animate-spin flex-shrink-0"
  >
    <circle
      cx="6"
      cy="6"
      r="4.5"
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="1.5"
    />
    <path
      d="M10.5 6a4.5 4.5 0 0 0-4.5-4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default Spinner
