import SetClappLogo from "../../shared/SetClappLogo";
import { styles } from "../../../styles/business-card/BusinessCardPublicView.styles";

export function SetClappPublicFooter() {
  return (
    <div style={styles.publicFooter} className="setclapp-public-footer">
      <SetClappLogo height={22} />
      <span>© 2019 - 2026 SetClapp MMC</span>
    </div>
  );
}
