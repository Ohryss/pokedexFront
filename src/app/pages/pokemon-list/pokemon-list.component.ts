import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Paginate } from '../../shared/interfaces/paginate';
import { Pokemon } from '../../shared/interfaces/pokemon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemonList?: Paginate<Pokemon>;
  filteredPokemonList: Pokemon[] = [];
  isLoading: boolean = false;
  showMenuPopup: boolean = false;

  searchQuery: string = '';
  showFilterPopup: boolean = false; // Contrôle l'affichage de la popup
  types: any[] = []; // Liste des types pour le filtre
  selectedType: number | null = null; // Type sélectionné

  constructor(public apiService: ApiService, private router: Router) {
    this.loadTypes();
  }

  ngOnInit(): void {
    this.loadTypes();
    this.loadNextPokemonPage();
  }

// Charge les types disponibles
loadTypes(): void {
  this.apiService.requestApi('/types', 'GET').then((data: any[]) => {
    this.types = data; // Mettre à jour les types pour le filtre
  });
}


// Applique les filtres et recharge les données
applyFilter(): void {
  this.showFilterPopup = false; // Ferme la popup
  this.pokemonList = undefined; // Réinitialise la liste
  this.filteredPokemonList = []; // Réinitialise les résultats
  this.loadFilteredPokemonPage(); // Recharge les Pokémon
}loadFilteredPokemonPage() {
  this.isLoading = true;

  this.apiService
    .requestApi('/pokemon', 'GET', { type: this.selectedType })
    .then((pokemons: Paginate<Pokemon>) => {
      this.pokemonList = pokemons;
      this.filteredPokemonList = pokemons?.data || [];
    })
    .finally(() => {
      this.isLoading = false;
    });
}





  goToSearchResults(): void {
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchQuery } });
  }

  // Charger la page initiale ou filtrée
  loadNextPokemonPage() {
    if (this.isLoading) return;

    this.isLoading = true;
    const page = this.pokemonList ? this.pokemonList.current_page + 1 : 1;

    const params: any = { page };
    if (this.selectedType) params.type = this.selectedType; // Ajoute le filtre type s'il est sélectionné

    this.apiService.requestApi('/pokemon', 'GET', params).then((pokemons: Paginate<Pokemon>) => {
      this.pokemonList = this.pokemonList
        ? { ...pokemons, data: this.pokemonList.data.concat(pokemons.data) }
        : pokemons;
      this.filteredPokemonList = this.pokemonList?.data || [];
    }).finally(() => {
      this.isLoading = false;
    });
  }

  // Filtrer par type
  onTypeFilterChange(): void {
    this.pokemonList = undefined; // Réinitialise la liste
    this.loadNextPokemonPage();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const threshold = 150;
    const position = window.innerHeight + window.pageYOffset;
    const height = document.body.scrollHeight;

    if (position >= height - threshold && !this.isLoading) {
      this.loadNextPokemonPage();
    }
  }

  toggleMenuPopup() {
    this.showMenuPopup = !this.showMenuPopup;
    if (this.showMenuPopup) this.showFilterPopup = false; // Ferme l'autre popup
  }
  
  toggleFilterPopup() {
    this.showFilterPopup = !this.showFilterPopup;
    if (this.showFilterPopup) this.showMenuPopup = false; // Ferme l'autre popup
  }
  
  onBackdropClick(event: MouseEvent, popupType: string): void {
    const target = event.target as HTMLElement;
    if (popupType === 'menu' && target.classList.contains('profile-popup')) {
      this.toggleMenuPopup();
    } else if (popupType === 'filter' && target.classList.contains('filter-popup')) {
      this.toggleFilterPopup();
    }
  }
  

  logout() {
    this.apiService.logout();
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  goToProfile(): void {
    this.toggleMenuPopup();
    this.router.navigate(['/profile']);
  }
}
