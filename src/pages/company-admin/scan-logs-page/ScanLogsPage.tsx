import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/shared/PageHeader";
import StatsScanLogsSection from "./parts/StatsScanLogsSection";
import { strings } from "../../../constants/strings";

export default function ScanLogsPage() {
  const navigate = useNavigate();

  const openEmployeeCard = (id: string) => {
    navigate(`/admin/card?context=company&view=card&employeeId=${id}`);
  };

  return (
    <div>
      <PageHeader title={strings.navigation.scanLogs} />
      <StatsScanLogsSection onSelectEmployee={openEmployeeCard} />
    </div>
  );
}
