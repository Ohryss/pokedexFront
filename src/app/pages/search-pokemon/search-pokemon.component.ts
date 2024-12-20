import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-search-pokemon',
  templateUrl: './search-pokemon.component.html',
  styleUrl: './search-pokemon.component.scss'
})
export class SearchPokemonComponent {


  constructor(
    public apiService: ApiService
  ){
    this.apiService.requestApi('/pokemon/search', "GET", {query : 'mar'})
    .then(reponses => {
      console.log(reponses);
    })
  }
}


