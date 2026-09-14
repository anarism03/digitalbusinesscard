import { getSetClappLogoImageStyle } from "../../styles/shared/BasicShared.styles";

interface SetClappLogoProps {
  height?: number;
}

export default function SetClappLogo({ height = 40 }: SetClappLogoProps) {
  return (
    <span className="setclapp-logo">
      <img
        src="/setclapp-logo.svg"
        alt="SetClapp"
        style={getSetClappLogoImageStyle(height)}
      />
    </span>
  );
}
