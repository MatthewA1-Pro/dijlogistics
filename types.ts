
export interface Rate {
  origin: string;
  destination: string;
  type: 'Aéreo' | 'Marítimo';
  price: string;
  unit: string;
  note?: string;
  details?: string[];
  flags?: string[];
}

export interface ServiceCategory {
  title: string;
  rates: Rate[];
}
