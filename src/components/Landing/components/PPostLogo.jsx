/**
 * Wordmark SVG. Default viewBox fits "PPost Designer" without clipping.
 * Pass className for size (e.g. h-9 w-auto) and color (text-orange-500/20).
 */
const PPostLogo = ({ variant = 'full', ...props }) => {
  const copy = variant === 'short' ? 'PPost' : 'PPost Designer';
  const viewBox = variant === 'short' ? '0 0 200 64' : '0 0 520 72';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <text
        x="8"
        y="50"
        fill="currentColor"
        fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', serif"
        fontSize="44"
        fontWeight="800"
        fontStyle="italic"
        letterSpacing="-0.03em"
      >
        {copy}
      </text>
    </svg>
  );
};

export default PPostLogo;
