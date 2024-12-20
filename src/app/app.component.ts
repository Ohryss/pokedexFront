import { Component, OnInit } from '@angular/core';
import { ApiService } from "./shared/services/api.service";
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Correction de 'styleUrl' -> 'styleUrls'
})
export class AppComponent implements OnInit {
  title = 'pokedex-front';

  constructor(
    public apiService: ApiService,
    private themeService: ThemeService // Injection du ThemeService
  ) {}

  ngOnInit(): void {
    // Appliquer le thème enregistré dans localStorage au démarrage
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    this.themeService.applyTheme(savedTheme);

    // Exemple d'appel à l'API Pokémon
    this.apiService.requestApi('/pokemon').then((pokemons) => {
      console.log('Liste des Pokémons :', pokemons);
    });
  }
}
