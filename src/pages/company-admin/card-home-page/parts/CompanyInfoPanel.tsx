import {
  BankOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useMyCompany } from "../../../../hooks/useCompanies";
import CompanyLogo from "../../../../components/shared/CompanyLogo";
import ErrorState from "../../../../components/shared/ErrorState";
import LoadingSkeleton from "../../../../components/shared/LoadingSkeleton";
import { publicLinkHref } from "../../../../utils/url";
import "../../../../styles/company-admin/CompanyInfoPanel.css";

export default function CompanyInfoPanel() {
  const { data: company, isLoading, isError, refetch } = useMyCompany();

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !company) return <ErrorState onRetry={() => refetch()} />;

  const emailHref = company.email
    ? publicLinkHref(`mailto:${company.email}`)
    : "";
  const emailIsExternal = /^https?:\/\//i.test(emailHref);

  return (
    <div className="company-info-page">
      <section className="company-info-card" aria-label="Şirkət məlumatları">
        <svg
          className="company-info-card-waves"
          viewBox="0 0 600 360"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="company-card-top-silver"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#f1f3f6" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#dce2e9" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient
              id="company-card-bottom-silver"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="55%" stopColor="#f4f6f8" stopOpacity="0.58" />
              <stop offset="100%" stopColor="#e0e5eb" stopOpacity="0.92" />
            </linearGradient>
          </defs>
          <path
            d="M345 -48C391 6 422 70 478 101C525 128 581 128 636 116V-48Z"
            fill="url(#company-card-top-silver)"
          />
          <path
            d="M254 410C328 292 400 207 492 176C542 159 594 157 636 170V410Z"
            fill="url(#company-card-bottom-silver)"
          />
          <g fill="none" stroke="currentColor" strokeWidth="1.15">
            <path d="M337 -49C387 9 414 76 475 112C522 140 578 141 636 128" />
            <path d="M355 -49C402 4 431 65 489 99C535 125 583 126 636 116" />
            <path d="M374 -49C418 0 448 57 502 88C545 112 590 113 636 104" />
            <path d="M255 410C321 302 396 214 492 180C542 162 591 164 636 178" />
            <path d="M279 410C343 315 410 236 500 202C548 184 594 184 636 198" />
            <path d="M303 410C367 327 429 254 511 224C554 208 597 207 636 218" />
            <path d="M327 410C391 338 446 275 520 247C560 232 600 231 636 240" />
          </g>
        </svg>

        <div className="company-info-card-content">
          <div className="company-info-logo">
            <CompanyLogo
              src={company.logoUrl}
              name={company.name}
              size={65}
              variant="plain"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <h1 className="company-info-name">{company.name}</h1>
          {company.voen && (
            <div className="company-info-voen">
              <BankOutlined
                className="company-info-voen-icon"
                aria-hidden="true"
              />
              <span>
                <span className="company-info-voen-label">VÖEN</span>
                <span className="company-info-voen-value">{company.voen}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {(company.address || company.email || company.phone) && (
        <section
          className="company-info-contacts"
          aria-labelledby="company-info-contacts-title"
        >
          <h2 id="company-info-contacts-title">Əlaqə</h2>
          <div className="company-info-contact-list">
            {company.address && (
              <div className="company-info-contact-row">
                <EnvironmentOutlined
                  className="company-info-contact-icon"
                  aria-hidden="true"
                />
                <span className="company-info-contact-label">Ünvan</span>
                <span className="company-info-contact-value">
                  {company.address}
                </span>
              </div>
            )}
            {company.email && (
              <a
                href={emailHref}
                target={emailIsExternal ? "_blank" : undefined}
                rel={emailIsExternal ? "noreferrer" : undefined}
                className="company-info-contact-row company-info-contact-link"
              >
                <MailOutlined
                  className="company-info-contact-icon"
                  aria-hidden="true"
                />
                <span className="company-info-contact-label">E-poçt</span>
                <span className="company-info-contact-value">
                  {company.email}
                </span>
              </a>
            )}
            {company.phone && (
              <a
                href={`tel:${company.phone}`}
                className="company-info-contact-row company-info-contact-link"
              >
                <PhoneOutlined
                  className="company-info-contact-icon"
                  aria-hidden="true"
                />
                <span className="company-info-contact-label">Telefon</span>
                <span className="company-info-contact-value">
                  {company.phone}
                </span>
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
