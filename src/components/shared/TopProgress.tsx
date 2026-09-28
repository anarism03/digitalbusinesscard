import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getProgressBarStyle,
  styles,
} from "../../styles/shared/TopProgress.styles";

export default function TopProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setVisible(true);
    setProgress(20);
    const t1 = setTimeout(() => setProgress(75), 60);
    const t2 = setTimeout(() => setProgress(100), 260);
    const t3 = setTimeout(() => setVisible(false), 480);
    const t4 = setTimeout(() => setProgress(0), 620);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.pathname]);

  return (
    <div style={styles.root}>
      <div style={getProgressBarStyle(progress, visible)} />
    </div>
  );
}
