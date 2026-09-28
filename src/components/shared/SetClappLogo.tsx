interface SetClappLogoProps {
  height?: number;
}

export default function SetClappLogo({ height = 40 }: SetClappLogoProps) {
  return (
    <span className="setclapp-logo">
      <img
        src="/setclapp-logo.svg"
        alt="SetClapp"
        style={{ display: "block", width: "auto", flexShrink: 0, height }}
      />
    </span>
  );
}
