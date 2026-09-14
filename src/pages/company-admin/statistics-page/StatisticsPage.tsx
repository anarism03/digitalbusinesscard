import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/shared/PageHeader";
import StatsOverviewSection from "./parts/StatsOverviewSection";

export default function StatisticsPage() {
  const navigate = useNavigate();

  const openEmployeeCard = (id: string) => {
    navigate(`/admin/card?context=company&view=card&employeeId=${id}`);
  };

  return (
    <div>
      <PageHeader title="Statistika" />
      <StatsOverviewSection onSelectEmployee={openEmployeeCard} />
    </div>
  );
}
