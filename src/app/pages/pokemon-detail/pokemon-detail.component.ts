import { Component, OnInit } from '@angular/core';
import { Pokemon } from "../../shared/interfaces/pokemon";
import { ApiService } from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {

  pokemon!: Pokemon;
  learnMoves: any[] = []; // Ajout du tableau pour stocker les moves appris

  // Correspondance entre les numéros et les types
  private readonly TYPE_NAMES: { [key: number]: string } = {
    1: 'normal',
    2: 'fighting',
    3: 'flying',
    4: 'poison',
    5: 'ground',
    6: 'rock',
    7: 'bug',
    8: 'ghost',
    9: 'steel',
    10: 'fire',
    11: 'water',
    12: 'grass',
    13: 'electric',
    14: 'psychic',
    15: 'ice',
    16: 'dragon',
    17: 'dark',
    18: 'fairy',
    19: 'stellar'
  };

  // Correspondance des couleurs pour chaque type
  private readonly TYPE_COLORS: { [key: string]: string } = {
    normal: '#A8A77A',
    fighting: '#C22E28',
    flying: '#A98FF3',
    poison: '#A33EA1',
    ground: '#E2BF65',
    rock: '#B6A136',
    bug: '#A6B91A',
    ghost: '#735797',
    steel: '#B7B7CE',
    fire: '#EE8130',
    water: '#6390F0',
    grass: '#7AC74C',
    electric: '#F7D02C',
    psychic: '#F95587',
    ice: '#96D9D6',
    dragon: '#6F35FC',
    dark: '#705746',
    fairy: '#D685AD',
    stellar: '#E2E2E2'
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupération de l'identifiant du Pokémon dans l'URL
    this.route.params.subscribe(params => {
      if (params['pokemon_id']) {
        this.getPokemonDetails(params['pokemon_id']);
        this.getPokemonLearnMoves(params['pokemon_id']); // Récupération des moves
      }
    });
  }

  // Fonction pour obtenir les détails du Pokémon
  getPokemonDetails(id: string): void {
    this.apiService.requestApi(`/pokemon/${id}`)
      .then((response: Pokemon) => {
        this.pokemon = response;
      });
  }

  // Fonction pour obtenir les moves appris par le Pokémon
  getPokemonLearnMoves(id: string): void {
    this.apiService.requestApi(`/pokemon/${id}/learn-moves`)
      .then((moves: any[]) => {
        this.learnMoves = moves;
      });
  }

  // Fonction pour obtenir les noms des types à partir des numéros
  getTypeNames(): string[] {
    if (!this.pokemon || !this.pokemon.default_variety.types) {
      return [];
    }
    
    // Map les numéros de types aux noms des types
    return this.pokemon.default_variety.types.map((type: any) => this.TYPE_NAMES[type.id]);
  }

  // Fonction pour générer un style de fond en fonction des types
  getBackgroundStyle(): string {
    const types = this.getTypeNames();
    
    if (types.length === 1) {
      // Un seul type, couleur unie
      return this.TYPE_COLORS[types[0]];
    } else if (types.length === 2) {
      // Deux types, appliquer un dégradé
      const color1 = this.TYPE_COLORS[types[0]];
      const color2 = this.TYPE_COLORS[types[1]];
      return `linear-gradient(to top right, ${color1}, ${color2})`;
    }
    return '';
  }
}
