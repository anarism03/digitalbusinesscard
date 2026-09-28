import { useState } from "react";
import type { ComponentType, CSSProperties } from "react";
import {
  EditOutlined,
  LeftOutlined,
  LockOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import VCardDownloadButton from "./VCardDownloadButton";
import GroupedLinkModal from "./parts/GroupedLinkModal";
import SetClappPublicFooter from "./parts/SetClappPublicFooter";
import { ContactTile, IconTile, LinkCard } from "./parts/PublicLinkTiles";
import ShareProfileSheet from "../shared/ShareProfileSheet";
import { useFrameContainer } from "../layout/FrameContainerContext";
import { useAssetSrc } from "../../hooks/useAssetSrc";
import { buildViewLinkRows, groupViewLinkRows } from "../../utils/cardLinkRows";
import { getCardThemeStyle } from "../../utils/cardTheme";
import {
  getContactCardFields,
  hasContactCardFields,
  isContactCardEnabled,
  normalizeContactCardButtonLabel,
} from "../../utils/contactCardFields";
import { overridesFromContactCard } from "../../utils/vcard";
import {
  getCoverStyle,
  styles,
} from "../../styles/business-card/BusinessCardPublicView.styles";
import type {
  Employee,
  LinkCategory,
  PublicLinkProps,
  ViewLinkGroup,
  ViewLinkRow,
} from "../../types";

interface Props {
  employee: Employee;
  onEdit?: () => void;
  onBack?: () => void;
  onChangePassword?: () => void;
}

interface LinkSection {
  title: string;
  groups: ViewLinkGroup[];
  layout: CSSProperties;
  Tile: ComponentType<PublicLinkProps>;
}

function categoryGroups(
  rows: ViewLinkRow[],
  category: LinkCategory,
  excludeId?: string,
): ViewLinkGroup[] {
  return groupViewLinkRows(
    rows.filter((row) => row.category === category && row.id !== excludeId),
  );
}

export default function BusinessCardPublicView({
  employee,
  onEdit,
  onBack,
  onChangePassword,
}: Props) {
  const logoSrc = useAssetSrc(employee.companyLogoUrl);
  const photoSrc = useAssetSrc(employee.photoUrl);
  const backgroundSrc = useAssetSrc(employee.cardBackgroundUrl) || logoSrc;
  const [selectedGroup, setSelectedGroup] = useState<ViewLinkGroup | null>(
    null,
  );
  const [shareOpen, setShareOpen] = useState(false);
  const inheritedFrameContainer = useFrameContainer();
  const contactCardFields = getContactCardFields(employee.contactInfos);
  const contactCardEnabled = isContactCardEnabled(employee.contactInfos);
  const showContactCard =
    hasContactCardFields(contactCardFields) && contactCardEnabled;
  const profileDescription = employee.additionalInfo?.trim();
  const roleAndCompany = [
    employee.jobTitle?.trim(),
    employee.companyName?.trim(),
  ]
    .filter(Boolean)
    .join(" · ");

  const rows = buildViewLinkRows(employee).filter(
    (row) => row.id !== "core:phone2",
  );
  const linkSections: LinkSection[] = [
    {
      title: "Əlaqələr",
      groups: categoryGroups(rows, "contact"),
      layout: styles.contactGrid,
      Tile: ContactTile,
    },
    {
      title: "Web Saytlar",
      groups: categoryGroups(rows, "other", "core:googleMapsUrl"),
      layout: styles.linkList,
      Tile: LinkCard,
    },
    {
      title: "Sosial media",
      groups: categoryGroups(rows, "social"),
      layout: styles.socialGrid,
      Tile: IconTile,
    },
    {
      title: "Musiqi",
      groups: categoryGroups(rows, "music"),
      layout: styles.socialGrid,
      Tile: IconTile,
    },
    {
      title: "Biznes",
      groups: categoryGroups(rows, "business"),
      layout: styles.linkList,
      Tile: LinkCard,
    },
  ];

  return (
    <main
      className={
        inheritedFrameContainer
          ? "public-card-page public-card-page--embedded"
          : "public-card-page"
      }
    >
      <div
        className={
          inheritedFrameContainer
            ? "public-card-frame--passthrough"
            : "public-card-frame"
        }
      >
        <article
          className="public-card premium-card-surface"
          style={{
            ...styles.card,
            ...getCardThemeStyle(employee.companyName || employee.companyId),
          }}
        >
          <section
            className="public-card-cover"
            style={getCoverStyle(backgroundSrc)}
          >
            {backgroundSrc ? (
              <img
                className="public-card-cover-media"
                src={backgroundSrc}
                alt=""
                aria-hidden="true"
                decoding="async"
                style={styles.coverMedia}
              />
            ) : (
              <span style={styles.coverPattern} />
            )}
            {(onBack || onChangePassword) && (
              <div style={styles.coverLeftControls}>
                {onBack && (
                  <button
                    type="button"
                    className="premium-back-control"
                    aria-label="Geri qayıt"
                    onClick={onBack}
                    style={styles.coverBackButton}
                  >
                    <LeftOutlined />
                  </button>
                )}
                {onChangePassword && (
                  <button
                    type="button"
                    className="card-cover-password"
                    aria-label="Şifrəni dəyiş"
                    onClick={onChangePassword}
                    style={styles.coverPasswordButton}
                  >
                    <LockOutlined />
                    <span className="card-cover-password-label">
                      Şifrəni dəyiş
                    </span>
                  </button>
                )}
              </div>
            )}
            {onEdit && (
              <button
                type="button"
                className="card-cover-edit"
                aria-label="Profili düzəliş et"
                onClick={onEdit}
                style={styles.coverEditButton}
              >
                <EditOutlined />
                <span className="card-cover-edit-label">
                  Profili düzəliş et
                </span>
              </button>
            )}
          </section>

          <section
            className="premium-card-profile"
            style={styles.profileSection}
          >
            <div className="premium-card-avatar-wrap" style={styles.avatarWrap}>
              <div className="premium-card-avatar" style={styles.avatarCircle}>
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={employee.fullName}
                    style={styles.avatar}
                  />
                ) : (
                  <span style={styles.avatarFallback}>
                    {employee.fullName?.[0]?.toUpperCase() ?? "?"}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="premium-floating-control premium-share-control"
                onClick={() => setShareOpen(true)}
                aria-label="Paylaşmaq"
                style={styles.shareButton}
              >
                <ShareAltOutlined />
              </button>
            </div>
            <h1 style={styles.name}>{employee.fullName}</h1>
            {roleAndCompany && (
              <p style={styles.roleAndCompany}>{roleAndCompany}</p>
            )}
          </section>

          <section className="premium-card-content" style={styles.content}>
            {showContactCard && (
              <VCardDownloadButton
                employee={employee}
                label={normalizeContactCardButtonLabel(
                  contactCardFields.buttonLabel,
                )}
                overrides={overridesFromContactCard(
                  contactCardFields,
                  contactCardEnabled,
                )}
              />
            )}

            {profileDescription && (
              <section className="premium-card-about" style={styles.aboutCard}>
                <h2 style={styles.aboutTitle}>Haqqımda</h2>
                <p style={styles.aboutText}>{profileDescription}</p>
              </section>
            )}

            {linkSections.map(
              ({ title, groups, layout, Tile }) =>
                groups.length > 0 && (
                  <div
                    key={title}
                    className="premium-card-section"
                    style={styles.section}
                  >
                    <h2 style={styles.sectionTitle}>{title}</h2>
                    <div style={layout}>
                      {groups.map((group) => (
                        <Tile
                          key={group.key}
                          group={group}
                          onOpen={setSelectedGroup}
                        />
                      ))}
                    </div>
                  </div>
                ),
            )}
          </section>

          {!inheritedFrameContainer && <SetClappPublicFooter />}
        </article>

        <GroupedLinkModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />

        <ShareProfileSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          employee={employee}
          rootClassName={
            inheritedFrameContainer ? undefined : "public-share-sheet"
          }
        />
      </div>
    </main>
  );
}
