import SetClappLogo from "../../shared/SetClappLogo";
import { styles } from "../../../styles/business-card/SetClappPublicFooter.styles";

export default function SetClappPublicFooter() {
  return (
    <div style={styles.footer} className="setclapp-public-footer">
      <a
        href="https://www.setclapp.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SetClapp"
        style={styles.logoLink}
      >
        <SetClappLogo height={22} />
      </a>
      <span>© 2019 - 2026 SetClapp MMC</span>
    </div>
  );
}
