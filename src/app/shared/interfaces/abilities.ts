export interface Abilities {
  id: number;
  name: string;
  description: string;
  effect?: string;
  is_hidden: boolean;
  translations?: AbilityTranslation[];
}


export interface AbilityTranslation {
  id: number;
  ability_id: number;
  locale: string;
  name: string;
  description: string;
  effect: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}
