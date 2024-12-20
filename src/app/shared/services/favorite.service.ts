import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../interfaces/favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8000/api/pokemon';

  constructor(private http: HttpClient) {}

  // Ajouter un Pokémon aux favoris
  addFavorite(pokemonId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${pokemonId}/favorite`, {});
  }

  // Récupérer les Pokémon favoris
  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/favorites`);
  }

  // Supprimer un Pokémon des favoris
  removeFavorite(pokemonId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${pokemonId}/favorite`);
  }
}
