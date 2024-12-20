import { User } from "./user";
import { Pokemon } from "./pokemon";

export interface Favorite {
  id?: number;         
  user_id: number;
  pokemon_id: number;
  user?: User;       
  pokemon?: Pokemon;    
  created_at?: string; 
  updated_at?: string; 
  
}
export interface Favorite {
    pokemon_id: number;
  }
  
