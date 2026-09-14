import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BusinessCardPublicView, {
  SetClappPublicFooter,
} from "../../components/business-card/BusinessCardPublicView";
import { strings } from "../../constants/strings";
import { publicService } from "../../services/public.service";
import type { Employee } from "../../types";
import { mapPublicCard } from "../../utils/mappers";
import {
  getMessageIconStyle,
  getMessageTitleStyle,
  styles,
} from "../../styles/public/CardPage.styles";

const s = strings.publicCard;

function setMetaTag(key: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function CenterBox({ children }: { children: ReactNode }) {
  return (
    <div className="premium-status-page" style={styles.centerBox}>
      {children}
    </div>
  );
}

function MessageCard({
  title,
  subtitle,
  iconColor = "#1e63d6",
  titleColor,
}: {
  title: string;
  subtitle?: string;
  iconColor?: string;
  titleColor?: string;
}) {
  return (
    <CenterBox>
      <div className="premium-status-card" style={styles.messageCard}>
        <ExclamationCircleOutlined style={getMessageIconStyle(iconColor)} />
        <h2 style={getMessageTitleStyle(titleColor)}>{title}</h2>
        {subtitle && <p style={styles.messageSubtitle}>{subtitle}</p>}
      </div>
    </CenterBox>
  );
}

function InactiveCardMessage() {
  return (
    <main className="public-card-page">
      <div className="public-card-frame">
        <div className="page-fade" style={styles.inactiveBody}>
          <span style={styles.inactiveIconBadge}>
            <ExclamationCircleOutlined style={styles.inactiveIcon} />
          </span>
          <h2 style={styles.inactiveTitle}>{s.inactive}</h2>
        </div>
        <SetClappPublicFooter />
      </div>
    </main>
  );
}

function isDeactivatedCard(error: unknown): boolean {
  const data = (error as { response?: { data?: unknown } })?.response?.data;
  if (data && typeof data === "object") {
    const d = data as { status?: unknown; message?: unknown };
    if (String(d.status).toLowerCase() === "deactivated") return true;
    if (typeof d.message === "string" && /qeyri-?aktiv|deaktiv/i.test(d.message)) {
      return true;
    }
  }
  return false;
}

export default function CardPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") ?? undefined;

  const [employee, setEmployee] = useState<Employee | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const fetchedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const dedupeKey = `${id}::${source ?? ""}`;
    if (fetchedKeyRef.current === dedupeKey) return;

    fetchedKeyRef.current = dedupeKey;
    setIsLoading(true);
    setIsError(false);

    publicService
      .getCard(id, source)
      .then(mapPublicCard)
      .then((data) => setEmployee(data))
      .catch((err) => {
        setIsError(true);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [id, source]);

  useEffect(() => {
    if (!employee) return;
    const title = [employee.fullName, employee.jobTitle, employee.companyName]
      .filter(Boolean)
      .join(" — ");
    document.title = title || "Vizitkart";
    setMetaTag("description", `${employee.fullName} — rəqəmsal vizitkart`);
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", employee.jobTitle ?? "", true);
    return () => {
      document.title = "Digital Business Card";
    };
  }, [employee]);

  if (isLoading) {
    return (
      <CenterBox>
        <div
          className="premium-status-card premium-loading-card"
          style={styles.loadingCard}
        >
          <Skeleton avatar={{ size: 80 }} active paragraph={{ rows: 6 }} />
        </div>
      </CenterBox>
    );
  }

  if (isDeactivatedCard(error)) return <InactiveCardMessage />;

  const roleText = String(employee?.role ?? "").toLowerCase();
  const isSuperAdmin =
    employee?.role === 0 ||
    roleText === "superadmin" ||
    roleText === "super_admin" ||
    roleText === "super-admin";

  if (isError || !employee || isSuperAdmin) {
    return <MessageCard title={s.notFound} subtitle={s.notFoundSubtext} />;
  }

  return <BusinessCardPublicView employee={employee} />;
}
