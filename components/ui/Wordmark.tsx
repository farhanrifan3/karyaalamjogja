import Image from "next/image";

type WordmarkProps = {
  withText?: boolean;
};

export function Wordmark({ withText = true }: WordmarkProps) {
  return (
    <span className="wordmark" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
      <Image
        src="/images/brand/rebranding-logo.png"
        alt="Karya Alam Logo"
        width={26}
        height={26}
        style={{ borderRadius: "4px", objectFit: "cover" }}
      />
      {withText ? (
        <Image
          src="/images/brand/text-logo.png"
          alt="Karya Alam"
          width={110}
          height={26}
          style={{ objectFit: "contain" }}
        />
      ) : null}
    </span>
  );
}
