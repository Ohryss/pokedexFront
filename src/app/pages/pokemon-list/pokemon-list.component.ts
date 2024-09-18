import { Component } from '@angular/core';
import {ApiService} from "../../shared/services/api.service";
import {Paginate} from "../../shared/interfaces/paginate";
import {Pokemon} from "../../shared/interfaces/pokemon";

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent {

  pokemonList?: Paginate<Pokemon>;

// Function to load all pokemon pages recursively
loadAllPokemonPages(page: number = 1) {
  // Check if we haven't reached the last page
  if (!this.pokemonList || this.pokemonList.last_page >= page) {
    // Fetch the next page
    this.apiService.requestApi('/pokemon', 'GET', {page: page}).then((pokemons: Paginate<Pokemon>) => {
      // Add new Pokémon to the list
      if (!this.pokemonList) {
        this.pokemonList = pokemons;
      } else {
        let datas = this.pokemonList.data.concat(pokemons.data);
        this.pokemonList = {...pokemons, data: datas};
      }

      // Recursively call the function to load the next page
      this.loadAllPokemonPages(page + 1);
    });
  }
}

// Call this method in the constructor to load all pages
constructor(
  public apiService: ApiService,
) {
  this.loadAllPokemonPages();
}


  // Fonction pour charger la page suivante des pokemons
  loadNextPokemonPage(){
    // On crée le numéro de la page à charger
    let page = 1
    if (this.pokemonList){
      page = this.pokemonList.current_page + 1;
    }


    
    // On charge la page si elle n'existe pas ou si on n'a pas atteint la dernière
    if (!this.pokemonList || this.pokemonList.last_page <= page){
      this.apiService.requestApi('/pokemon', 'GET', {page: page}).then((pokemons: Paginate<Pokemon>) => {
        // On ajoute les pokemons à la liste
        if (!this.pokemonList){
          this.pokemonList = pokemons;
        }else{
          let datas = this.pokemonList.data.concat(pokemons.data);
          this.pokemonList = {...pokemons, data: datas};
        }
      });
    }
  }
}


