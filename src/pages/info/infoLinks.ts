export interface InfoLinks {
  readonly home: string;
  readonly delivery: string;
  readonly warranty: string;
  readonly faq: string;
  readonly shops: string;
  readonly cart: string;
  readonly catalog: string;
  readonly compare: string;
  readonly favorites: string;
  readonly contacts: string;
  readonly privacy: string;
  readonly terms: string;
  readonly offer: string;
}

export type InfoLinkKey = keyof InfoLinks;
