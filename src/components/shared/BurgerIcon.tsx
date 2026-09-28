import {
  getBurgerBarStyle,
  getBurgerWrapStyle,
} from "../../styles/shared/BurgerIcon.styles";

const SIZE = 20;
export default function BurgerIcon({
  open,
  color = "#0f172a",
}: {
  open: boolean;
  color?: string;
}) {
  return (
    <span aria-hidden style={getBurgerWrapStyle(SIZE)}>
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
