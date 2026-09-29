import { useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardPanel from "./parts/CardPanel";
import TeamListSection from "./parts/TeamListSection";
import CompanyInfoPanel from "./parts/CompanyInfoPanel";
import { useAppSelector } from "../../../store/hooks";
import { parseCardViewParams } from "../../../utils/cardViewParams";
import { updateSearchParams } from "../../../utils/urlSearch";

export default function CardHomePage() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  const {
    context,
    view,
    employeeId: employeeIdParam,
    editMode,
  } = parseCardViewParams(searchParams);

  const goToTeamMember = useCallback((id: string, edit: boolean) => {
    setSearchParamsRef.current((current) =>
      updateSearchParams(current, {
        view: "card",
        employeeId: id,
        edit: edit ? "1" : null,
      }),
    );
  }, []);

  if (context === "company" && view === "team") {
    return <TeamListSection onSelectEmployee={goToTeamMember} />;
  }

  if (context === "company" && !employeeIdParam) {
    return <CompanyInfoPanel />;
  }

  const targetId =
    context === "company" && employeeIdParam
      ? employeeIdParam
      : (user?.id ?? "");
  const isOwnCard = targetId === user?.id;
  const setCardEditMode = (editing: boolean) => {
    setSearchParams(
      (current) => updateSearchParams(current, { edit: editing ? "1" : null }),
      { replace: true },
    );
  };

  const isCompanyAdminViewer = user?.role === "COMPANY_ADMIN";

  return (
    <CardPanel
      key={targetId}
      employeeId={targetId}
      isOwnCard={isOwnCard}
      editMode={editMode}
      onEditModeChange={setCardEditMode}
      onBack={
        isCompanyAdminViewer && context === "company"
          ? () => navigate(-1)
          : undefined
      }
      hideOwnPasswordButton={isCompanyAdminViewer}
    />
  );
}
