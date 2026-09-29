import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import axios from "axios";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BusinessCardPublicView from "../../components/business-card/BusinessCardPublicView";
import SetClappPublicFooter from "../../components/business-card/parts/SetClappPublicFooter";
import { ROLE_TO_NUM } from "../../constants/roles";
import { strings } from "../../constants/strings";
import { publicService } from "../../services/public.service";
import type { Employee } from "../../types";
import { mapPublicCard } from "../../utils/mappers";
import { styles } from "../../styles/public/CardPage.styles";

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

function MessageCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <CenterBox>
      <div className="premium-status-card" style={styles.messageCard}>
        <ExclamationCircleOutlined style={styles.messageIcon} />
        <h2 style={styles.messageTitle}>{title}</h2>
        <p style={styles.messageSubtitle}>{subtitle}</p>
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
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setEmployee(undefined);

    publicService
      .getCard(id, source)
      .then(mapPublicCard)
      .then((data) => {
        if (!cancelled) setEmployee(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err ?? new Error("Card request failed"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
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

  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return <MessageCard title={s.notFound} subtitle={s.notFoundSubtext} />;
    }

    const subtitle =
      axios.isAxiosError(error) && !error.response
        ? strings.errors.networkError
        : strings.errors.generic;
    return <MessageCard title="Vizitkart açılmadı" subtitle={subtitle} />;
  }

  if (!employee || employee.role === ROLE_TO_NUM.SUPER_ADMIN) {
    return <MessageCard title={s.notFound} subtitle={s.notFoundSubtext} />;
  }

  return <BusinessCardPublicView employee={employee} />;
}
