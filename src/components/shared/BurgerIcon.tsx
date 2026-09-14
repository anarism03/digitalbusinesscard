import {
  getBurgerBarStyle,
  getBurgerWrapStyle,
} from "../../styles/shared/BurgerIcon.styles";

interface BurgerIconProps {
  open: boolean;
  size?: number;
  color?: string;
}
export default function BurgerIcon({
  open,
  size = 20,
  color = "#0f172a",
}: BurgerIconProps) {
  return (
    <span aria-hidden style={getBurgerWrapStyle(size)}>
      <span
        style={getBurgerBarStyle(
          color,
          open ? 7 : 0,
          open ? "rotate(45deg)" : "none",
        )}
      />
      <span
        style={getBurgerBarStyle(
          color,
          7,
          open ? "translateX(-6px)" : "none",
          open ? 0 : 1,
        )}
      />
      <span
        style={getBurgerBarStyle(
          color,
          open ? 7 : 14,
          open ? "rotate(-45deg)" : "none",
        )}
      />
    </span>
  );
}
