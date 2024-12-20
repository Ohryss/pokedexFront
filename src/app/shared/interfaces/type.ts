export interface Type {
    id: number;
    sprite_url: string;
    name: string;
    pivot: {
      slot: number;
    }
    translations?: TypeTranslation[];
  }

  export interface TypeTranslation {
    locale: string;
    name: string;
  }
  