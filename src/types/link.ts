import type { ReactNode } from "react";

export type LinkType =
  | "contact-card"
  | "phone"
  | "email"
  | "messenger"
  | "whatsapp"
  | "whatsapp-business"
  | "sms"
  | "telegram"
  | "viber"
  | "zoom"
  | "skype"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "snapchat"
  | "threads"
  | "twitch"
  | "vk"
  | "wechat"
  | "x"
  | "github"
  | "discord"
  | "slack"
  | "spotify"
  | "applemusic"
  | "youtube-music"
  | "googlemaps"
  | "amazon"
  | "lalafo"
  | "tapaz"
  | "website";

export type LinkCategory =
  "contact" | "social" | "finance" | "music" | "business" | "other";

export type LinkFieldKind = "phone" | "email" | "url" | "username";

export type CoreLinkKey =
  | "phone1"
  | "phone2"
  | "whatsappPhone"
  | "linkedinUrl"
  | "facebookUrl"
  | "instagramUrl"
  | "googleMapsUrl";

export interface LinkTypeMeta {
  title: string;
  placeholder: string;
  icon: ReactNode;
  iconSrc?: string;
  category: LinkCategory;
  fieldKind: LinkFieldKind;
  urlPrefix?: string;
}

export interface ViewLinkRow {
  id: string;
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  value: string;
  href: string;
  tint: string;
  category: LinkCategory;
  platform?: string;
}

export interface ViewLinkGroup {
  key: string;
  rows: ViewLinkRow[];
  representative: ViewLinkRow;
}

export interface WebsiteLinkResult {
  headline: string;
  url: string;
  iconUrl?: string;
}

export interface QuickLinkResult {
  label: string;
  value: string;
}
