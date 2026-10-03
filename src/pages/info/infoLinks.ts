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
}

export type InfoLinkKey = keyof InfoLinks;
