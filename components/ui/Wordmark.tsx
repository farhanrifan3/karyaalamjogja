type WordmarkProps = {
  withText?: boolean;
};

export function Wordmark({ withText = true }: WordmarkProps) {
  return (
    <span className="wordmark">
      <svg
        className="wordmark__mark"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="1" y="3" width="11" height="4.4" fill="currentColor" />
        <rect x="14" y="3" width="9" height="4.4" fill="currentColor" />
        <rect x="1" y="9.8" width="7" height="4.4" fill="currentColor" />
        <rect x="10" y="9.8" width="13" height="4.4" fill="currentColor" />
        <rect x="1" y="16.6" width="13" height="4.4" fill="currentColor" />
        <rect x="16" y="16.6" width="7" height="4.4" fill="currentColor" />
      </svg>
      {withText ? <span className="wordmark__text">Karya Alam</span> : null}
    </span>
  );
}
