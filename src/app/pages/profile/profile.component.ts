import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ThemeService } from '../../shared/services/theme.service';
import { TranslocoService } from "@jsverse/transloco";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  profilePictureUrl: string = '';
  favoritePokemons: any[] = [];
  userId: number | null = null;
  currentLang: string = 'fr'; // Langue par défaut
  isDarkMode: boolean = false;

  constructor(private apiService: ApiService, private translocoService: TranslocoService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentLang = this.translocoService.getActiveLang(); // Récupère la langue active
    this.getUserProfile();
    this.isDarkMode = this.themeService.currentTheme === 'dark';
  }

  // Récupérer les informations de l'utilisateur
  getUserProfile(): void {
    this.apiService.requestApi('/user', 'GET').then((user: any) => {
      this.username = user.name;
      this.profilePictureUrl = user.profil_picture_url;
      this.userId = user.id;
      this.getUserFavorites();
    }).catch(error => {
      console.error('Erreur de récupération des informations utilisateur :', error);
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }
 

  // Récupérer les Pokémon favoris de l'utilisateur
  getUserFavorites(): void {
    if (this.userId) {
      const apiUrl = `/users/${this.userId}/favorites`;
      this.apiService.requestApi(apiUrl, 'GET').then((favorites: any[]) => {
        this.favoritePokemons = favorites.map((pokemon: any) => ({
          id: pokemon.id,
          name: pokemon.translations.find((t: any) => t.locale === this.currentLang)?.name || pokemon.name,
          // imageUrl: pokemon.default_variety.sprites.artwork_url,

          types: pokemon.default_variety.types.map((type: any) => ({
            // name: type.translations.find((t: any) => t.locale === this.currentLang)?.name || type.name,
            spriteUrl: type.sprite_url
          }))
        }));
      }).catch(error => {
        console.error('Erreur lors de la récupération des Pokémon favoris :', error);
      });
    } else {
      console.error("ID utilisateur non défini, impossible de récupérer les favoris.");
    }
  }
}
