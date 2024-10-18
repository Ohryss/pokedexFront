import { Component, HostListener } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Paginate } from '../../shared/interfaces/paginate';
import { Pokemon } from '../../shared/interfaces/pokemon';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']  // Correction du styleUrls (pluriel)
})
export class PokemonListComponent {
  
  pokemonList?: Paginate<Pokemon>;  // Liste paginée de Pokémon
  isLoading: boolean = false;  // Empêche plusieurs chargements en même temps

  constructor(
    public apiService: ApiService,
  ) {
    this.loadNextPokemonPage();  // Charger la première page au démarrage
  }

  // Fonction pour charger la page suivante des Pokémon
  loadNextPokemonPage() {
    if (this.isLoading) return;  // Empêche le double chargement
  
    let page = 1;
    if (this.pokemonList) {
      page = this.pokemonList.current_page + 1;  // Page suivante
    }
  
    // Vérifier qu'on ne dépasse pas la dernière page
    if (!this.pokemonList || page <= this.pokemonList.last_page) {
      this.isLoading = true;  // Indiquer que le chargement est en cours
  
      this.apiService.requestApi('/pokemon', 'GET', { page: page }).then((pokemons: Paginate<Pokemon>) => {
        if (!this.pokemonList) {
          this.pokemonList = pokemons;
        } else {
          let datas = this.pokemonList.data.concat(pokemons.data);
          this.pokemonList = { ...pokemons, data: datas };
        }
        this.isLoading = false;  // Charger terminé
  
        // Vérifier si la page a besoin de plus de contenu pour pouvoir scroller
        setTimeout(() => {
          const contentHeight = document.documentElement.scrollHeight;
          const viewportHeight = window.innerHeight;
          if (contentHeight <= viewportHeight && page < (this.pokemonList?.last_page ?? 0)) {
            this.loadNextPokemonPage();  // Charger la page suivante si nécessaire
          }
        }, 500);  // Attendre un court délai pour que la page se mette à jour
      }).catch(() => {
        this.isLoading = false;  // Désactiver en cas d'erreur
      });
    }
  }
  

  // Écouteur de défilement avec @HostListener
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    // Si on est proche du bas de la page, charger la page suivante
    const threshold = 150;  // Pixels avant d'atteindre le bas de la page
    const position = window.innerHeight + window.pageYOffset;
    const height = document.body.scrollHeight;

    if (position >= height - threshold && !this.isLoading) {
      this.loadNextPokemonPage();  // Charger la page suivante
    }
  }

  // Fonction trackBy pour optimiser le ngFor
  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;  // Utiliser l'id pour suivre les changements
  }
}
