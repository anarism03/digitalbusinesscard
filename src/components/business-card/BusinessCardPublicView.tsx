import { useState } from "react";
import {
  EditOutlined,
  LeftOutlined,
  LockOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import type { Employee } from "../../types";
import { useAssetSrc } from "../../hooks/useAssetSrc";
import {
  getContactCardFields,
  groupViewLinkRows,
  hasContactCardFields,
  isContactCardEnabled,
  type ViewLinkGroup,
  type ViewLinkRow,
} from "../../utils/cardLinkRows";
import VCardDownloadButton from "./VCardDownloadButton";
import { overridesFromContactCard } from "../../utils/vcard";
import { buildPublicCardRows } from "./publicCardRows";
import ShareProfileSheet from "../shared/ShareProfileSheet";
import { getCoverStyle, styles } from "../../styles/business-card/BusinessCardPublicView.styles";
import { SetClappPublicFooter } from "./parts/SetClappPublicFooter";
import { GroupedLinkModal } from "./parts/GroupedLinkModal";
import { ContactTile, IconTile, LinkCard } from "./parts/PublicLinkTiles";
import { useFrameContainer } from "../layout/FrameContainerContext";
import { getCardThemeStyle } from "../../utils/cardTheme";
import { normalizeContactCardButtonLabel } from "../../utils/contactCardFields";

export { SetClappPublicFooter };

interface Props {
  employee: Employee;
  companyLogo?: string;
  onEdit?: () => void;
  onBack?: () => void;
  onChangePassword?: () => void;
}

function categoryGroups(
  rows: ViewLinkRow[],
  category: ViewLinkRow["category"],
  excludeId?: string,
): ViewLinkGroup[] {
  return groupViewLinkRows(
    rows.filter((row) => row.category === category && row.id !== excludeId),
  );
}

export default function BusinessCardPublicView({
  employee,
  companyLogo,
  onEdit,
  onBack,
  onChangePassword,
}: Props) {
  const logoSrc = useAssetSrc(companyLogo ?? employee.companyLogoUrl);
  const photoSrc = useAssetSrc(employee.photoUrl);
  const rawBackgroundSrc = useAssetSrc(employee.cardBackgroundUrl);
  const backgroundSrc = rawBackgroundSrc || logoSrc;
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

  const rows = buildPublicCardRows(employee);
  const contactGroups = categoryGroups(rows, "contact");
  const socialGroups = categoryGroups(rows, "social");
  const musicGroups = categoryGroups(rows, "music");
  const businessGroups = categoryGroups(rows, "business");
  const otherGroups = categoryGroups(rows, "other", "core:googleMapsUrl");
  const frameClassName = inheritedFrameContainer
    ? "public-card-frame--passthrough"
    : "public-card-frame";
  const pageClassName = inheritedFrameContainer
    ? "public-card-page public-card-page--embedded"
    : "public-card-page";

  return (
    <main className={pageClassName}>
      <div className={frameClassName}>
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
            {!backgroundSrc && <span style={styles.coverPattern} />}
            {backgroundSrc && (
              <img
                className="public-card-cover-media"
                src={backgroundSrc}
                alt=""
                aria-hidden="true"
                decoding="async"
                style={styles.coverMedia}
              />
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
                <span className="card-cover-edit-label">Profili düzəliş et</span>
              </button>
            )}
          </section>

          <section className="premium-card-profile" style={styles.profileSection}>
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
            {employee.jobTitle && (
              <p style={styles.jobTitle}>{employee.jobTitle}</p>
            )}
            {employee.companyName && (
              <p style={styles.companyName}>{employee.companyName}</p>
            )}
            {profileDescription && (
              <p style={styles.description}>{profileDescription}</p>
            )}
          </section>

          <section className="premium-card-content" style={styles.content}>
            {showContactCard && (
              <VCardDownloadButton
                employee={employee}
                block
                label={normalizeContactCardButtonLabel(contactCardFields.buttonLabel)}
                overrides={overridesFromContactCard(
                  contactCardFields,
                  contactCardEnabled,
                )}
              />
            )}

            {contactGroups.length > 0 && (
              <div className="premium-card-section" style={styles.section}>
                <h2 style={styles.sectionTitle}>Əlaqələr</h2>
                <div style={styles.contactGrid}>
                  {contactGroups.map((group) => (
                    <ContactTile
                      key={group.key}
                      group={group}
                      onOpen={setSelectedGroup}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherGroups.length > 0 && (
              <div className="premium-card-section" style={styles.section}>
                <h2 style={styles.sectionTitle}>Web Saytlar</h2>
                <div style={styles.linkList}>
                  {otherGroups.map((group) => (
                    <LinkCard
                      key={group.key}
                      group={group}
                      onOpen={setSelectedGroup}
                    />
                  ))}
                </div>
              </div>
            )}

            {socialGroups.length > 0 && (
              <div className="premium-card-section" style={styles.section}>
                <h2 style={styles.sectionTitle}>Sosial media</h2>
                <div style={styles.socialGrid}>
                  {socialGroups.map((group) => (
                    <IconTile
                      key={group.key}
                      group={group}
                      onOpen={setSelectedGroup}
                    />
                  ))}
                </div>
              </div>
            )}

            {musicGroups.length > 0 && (
              <div className="premium-card-section" style={styles.section}>
                <h2 style={styles.sectionTitle}>Musiqi</h2>
                <div style={styles.socialGrid}>
                  {musicGroups.map((group) => (
                    <IconTile
                      key={group.key}
                      group={group}
                      onOpen={setSelectedGroup}
                    />
                  ))}
                </div>
              </div>
            )}

            {businessGroups.length > 0 && (
              <div className="premium-card-section" style={styles.section}>
                <h2 style={styles.sectionTitle}>Biznes</h2>
                <div style={styles.linkList}>
                  {businessGroups.map((group) => (
                    <LinkCard
                      key={group.key}
                      group={group}
                      onOpen={setSelectedGroup}
                    />
                  ))}
                </div>
              </div>
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
