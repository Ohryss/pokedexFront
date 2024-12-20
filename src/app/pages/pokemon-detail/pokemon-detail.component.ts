import { Component, OnInit, HostListener } from '@angular/core';
import { Pokemon } from "../../shared/interfaces/pokemon";
import { ApiService } from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";
import { GameVersion } from "../../shared/interfaces/game-version.ts";
import { AbilityTranslation, Abilities } from "../../shared/interfaces/abilities";
import { Type } from '../../shared/interfaces/type';
import { TranslocoService } from "@jsverse/transloco";
import { Location } from '@angular/common';


@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  // Pokémon details
  pokemon!: Pokemon;

  // Abilities
  abilities: Abilities[] = [];

  // Shiny display toggle
  showShiny: boolean = false;

  // Moves
  learnMoves: any[] = [];
  selectedMove: any = null;
  selectedGameVersion: string = "red-blue";
  gameVersions: GameVersion[] = [];
  filteredMoves: any[] = [];
  
  // Tabs
  activeTab: string = 'info';

  // Screen size
  isDesktop: boolean = false;

  // Audio
  isPlaying: boolean = false;
  audio: HTMLAudioElement | null = null;

  //évolution 
  evolutions: any[] = [];

  //résistance, faiblesse ...
  weaknessesData: any = { resistances: [], double_resistances: [], weaknesses: [], immune: [] };

  //user favori
  userId: number | null = null;
  isFavorite: boolean = false;

  // Type data
  private readonly TYPE_NAMES: { [key: number]: string } = {
    1: 'normal', 2: 'fighting', 3: 'flying', 4: 'poison',
    5: 'ground', 6: 'rock', 7: 'bug', 8: 'ghost',
    9: 'steel', 10: 'fire', 11: 'water', 12: 'grass',
    13: 'electric', 14: 'psychic', 15: 'ice', 16: 'dragon',
    17: 'dark', 18: 'fairy', 19: 'stellar'
  };

  private readonly TYPE_COLORS: { [key: string]: string } = {
    normal: '#A8A77A', fighting: '#C22E28', flying: '#A98FF3',
    poison: '#A33EA1', ground: '#E2BF65', rock: '#B6A136',
    bug: '#A6B91A', ghost: '#735797', steel: '#B7B7CE',
    fire: '#EE8130', water: '#6390F0', grass: '#7AC74C',
    electric: '#F7D02C', psychic: '#F95587', ice: '#96D9D6',
    dragon: '#6F35FC', dark: '#705746', fairy: '#D685AD',
    stellar: '#E2E2E2'
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private location: Location
  ) {}

  ngOnInit(): void {
    let pokemonId: number | null = null; // Déclaration en scope supérieur pour éviter les conflits
  
    // Gestion de la langue (traduction)
    const savedLang = localStorage.getItem('lang'); 
    if (savedLang) {
      this.translocoService.setActiveLang(savedLang);
    }
  
    // Récupération de l'utilisateur
    this.apiService.requestApi('/user')
      .then(user => {
        this.userId = user.id;
  
        // Vérifie si le Pokémon est favori une fois chargé
        if (pokemonId) {
          this.checkIfFavorite();
        }
      })
      .catch(error => {
        console.error('Erreur de récupération du user_id :', error);
      });
  
    // Abonnement aux paramètres de l'URL pour obtenir le pokemonId
    this.route.params.subscribe(params => {
      if (params['pokemon_id']) {
        pokemonId = +params['pokemon_id']; // Assigner l'ID du Pokémon
  
        // Charge les détails du Pokémon
        this.getPokemonDetails(pokemonId).then(() => {
          this.checkIfFavorite(); // Vérifie si le Pokémon est favori
  
          // Récupère et construit la lignée évolutive
          this.getAllEvolutions().then(allEvolutions => {
            this.buildEvolutionChain(pokemonId!, allEvolutions).then(chain => {
              this.evolutions = chain;
            });
          });
        });
  
        // Charge les mouvements, capacités et faiblesses
        this.getPokemonLearnMoves(pokemonId);
        this.getPokemonAbilities(pokemonId);
        this.getPokemonWeaknesses(pokemonId);
  
        // Vérifie la taille de l'écran
        this.checkScreenSize();
      }
    });
  
    // Récupération des versions de jeu
    this.getGameVersions();
  }
  
  
  getAllEvolutions(): Promise<any[]> {
    return this.apiService.requestApi('/evolutions');
  }

  //favori
  addToFavorites(): void {
    const pokemonId = this.pokemon.id;
  
    if (this.isFavorite) {
      // Retirer le Pokémon des favoris
      this.apiService.requestApi(`/pokemon/${pokemonId}/favorite`, 'DELETE')
        .then(response => {
          this.isFavorite = false; // Mise à jour de l'état
          alert('Pokémon retiré des favoris !');
        })
        .catch(error => {
          console.error('Erreur lors du retrait des favoris :', error);
        });
    } else {
      // Ajouter le Pokémon aux favoris
      this.apiService.requestApi(`/pokemon/${pokemonId}/favorite`, 'POST')
        .then(response => {
          this.isFavorite = true; // Mise à jour de l'état
          alert('Pokémon ajouté aux favoris !');
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout aux favoris :', error);
        });
    }
  }
  
  
  checkIfFavorite(): void {
    if (!this.pokemon || !this.pokemon.id) {
      return; // Ne fait rien si le Pokémon n'est pas encore chargé
    }
  
    const pokemonId = this.pokemon.id;
  
    this.apiService.requestApi(`/pokemon/${pokemonId}/is-favorite`, 'GET')
      .then(response => {
        this.isFavorite = response.is_favorite; // Attention ici : utilise la bonne clé de la réponse
      })
      .catch(error => {
        console.error('Erreur lors de la vérification des favoris :', error);
      });
  }
  
  

  getPokemonDetails(id: number): Promise<void> { // Accepts number type
    return this.apiService.requestApi(`/pokemon/${id}`)
      .then((response: Pokemon) => {
        this.pokemon = response;
       // console.log('Pokemon Details:', this.pokemon);
      })
      .catch(error => {
        console.error('Error fetching Pokémon details:', error);
      });
  } 

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isDesktop = window.innerWidth > 769;
  }

  buildEvolutionChain(pokemonId: number, allEvolutions: any[]): Promise<any[]> {
    const chain: any[] = [];
  
    // Fonction pour récupérer les évolutions précédentes
    const findPrevious = (id: number): Promise<void> => {
      const prevEvolution = allEvolutions.find(e => e.evolves_to_id === id);
      if (prevEvolution) {
        return this.getPokemonById(prevEvolution.pokemon_variety_id).then((prevPokemon: any) => {
          chain.unshift({
            id: prevPokemon.id,
            name: prevPokemon.name,
            sprite_url: prevPokemon.default_variety?.sprites?.artwork_url || '',
            min_level: prevEvolution.min_level || null
          });
          return findPrevious(prevEvolution.pokemon_variety_id); // Continue récursion
        });
      }
      return Promise.resolve();
    };
  
    // Fonction pour récupérer les évolutions suivantes
    const findNext = (id: number): Promise<void> => {
      const nextEvolution = allEvolutions.find(e => e.pokemon_variety_id === id);
      if (nextEvolution) {
        return this.getPokemonById(nextEvolution.evolves_to_id).then((nextPokemon: any) => {
          chain.push({
            id: nextPokemon.id,
            name: nextPokemon.name,
            sprite_url: nextPokemon.default_variety?.sprites?.artwork_url || '',
            min_level: nextEvolution.min_level || null
          });
          return findNext(nextEvolution.evolves_to_id); // Continue récursion
        });
      }
      return Promise.resolve();
    };
  
    // Ajouter le Pokémon actuel
    chain.push({
      id: this.pokemon.id,
      name: this.pokemon.name,
      sprite_url: this.pokemon.default_variety?.sprites?.artwork_url || '',
      min_level: null // Pas d'évolution pour le Pokémon de départ
    });
  
    // Exécuter les fonctions récursives
    return Promise.all([findPrevious(pokemonId), findNext(pokemonId)]).then(() => chain);
  }

  logPokemonTypeIds(): void {
    if (this.pokemon && this.pokemon.default_variety.types) {
      const typeIds = this.pokemon.default_variety.types.map((type: Type) => type.id);
      // console.log('Pokemon Type IDs:', typeIds);
    } else {
      console.log('No types found for this Pokémon.');
    }
  }

  getPokemonById(id: number): Promise<any> {
    return this.apiService.requestApi(`/pokemon/${id}`);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleAudio(): void {
    if (!this.audio) {
      this.audio = new Audio(this.pokemon.default_variety.cry_url);
      this.audio.addEventListener('ended', () => this.isPlaying = false);
    }

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }

    this.isPlaying = !this.isPlaying;
  }

  toggleShiny(): void {
    this.showShiny = !this.showShiny;
  }

  showMovePopup(move: any): void {
    this.selectedMove = move;
  }

  closeMovePopup(): void {
    this.selectedMove = null;
  }

  getGameVersions(): void {
    this.apiService.requestApi('/game-versions')
      .then((response: GameVersion[]) => {
        this.gameVersions = response;
        this.getAvailableGameVersions();
        if (this.gameVersions.length > 0) {
          this.selectedGameVersion = this.gameVersions[0].id.toString();
          this.filterMoves();
        }
      })
      .catch(error => {
        // Handle error
      });
  }

  getAvailableGameVersions(): void {
    this.gameVersions = this.gameVersions.filter(version =>
      this.learnMoves.some(move => move.game_version_id === version.id)
    );
  }

  getPokemonLearnMoves(id: number): void {
    this.apiService.requestApi(`/pokemon/${id}/learn-moves`)
      .then((moves: any[]) => {
        this.learnMoves = moves;
        this.filteredMoves = moves;
        this.getAvailableGameVersions();
      });
  }
  
  getPokemonAbilities(id: number): void {
    const locale = this.translocoService.getActiveLang(); // Langue active
  
    this.apiService.requestApi(`/pokemon/${id}/abilities`)
      .then((response: any[]) => {
        this.abilities = response.map(ability => {
          const translation = ability.translations?.find((t: AbilityTranslation) => t.locale === locale);
          return {
            id: ability.id,
            name: translation?.name || ability.name,
            description: translation?.description || ability.description,
            is_hidden: ability.is_hidden // Vérifie que is_hidden est présent
          };
        });
      })
      .catch(error => {
        console.error('Error fetching Pokémon abilities:', error);
      });
  }

  filterMoves(): void {
    if (this.selectedGameVersion !== null) {
      this.filteredMoves = this.learnMoves.filter(
        move => move.game_version_id === parseInt(this.selectedGameVersion, 10)
      );
    }
  }

  getTypeNames(): string[] {
    if (!this.pokemon || !this.pokemon.default_variety.types) {
      return [];
    }
    return this.pokemon.default_variety.types.map((type: any) => this.TYPE_NAMES[type.id]);
  }

  getBackgroundStyle(): string {
    const types = this.getTypeNames();
    if (types.length === 1) {
      return this.TYPE_COLORS[types[0]];
    } else if (types.length === 2) {
      const color1 = this.TYPE_COLORS[types[0]];
      const color2 = this.TYPE_COLORS[types[1]];
      return `linear-gradient(to top right, ${color1}, ${color2})`;
    }
    return '';
  }

  getTypeImageUrl(typeId: number): string {
    const typeName = this.TYPE_NAMES[typeId];
    if (!typeName) {
      return '';
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${typeId}.png`;
  }

  getPokemonWeaknesses(id: number): void {
    this.apiService.requestApi(`/pokemon/${id}/weaknesses`)
      .then(response => {
        this.weaknessesData = response;
       // console.log('Weaknesses Data:', this.weaknessesData);
      })
      .catch(error => {
        console.error('Error fetching weaknesses:', error);
      });
  }
  
  goBack(): void {
    this.location.back();
  }

  //traduction
  getPokemonName(): string {
    const locale = this.translocoService.getActiveLang(); // Langue active
    const translation = this.pokemon.translations?.find(t => t.locale === locale);
    return translation?.name || this.pokemon.name; // Nom traduit ou fallback au nom par défaut
  }
  getDescription(): string {
    const locale = this.translocoService.getActiveLang(); // Récupère la langue active
    const translation = this.pokemon.default_variety.translations?.find(t => t.locale === locale);
    return translation?.description || this.pokemon.default_variety.description || ''; // Fallback
  }

  getTypeImageUrlByName(typeName: string): string {
    const invertedTypeMapping: { [key: string]: number } = Object.fromEntries(
      Object.entries(this.TYPE_NAMES).map(([key, value]) => [value, Number(key)])
    );
  
    const typeNameLower = typeName.toLowerCase().trim();
    const typeId = invertedTypeMapping[typeNameLower];
  
    if (typeId) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${typeId}.png`;
    } else {
      console.warn(`Type image not found for: ${typeName}`);
      return '';
    }
  }
  getPokemonCategory(): string {
    const locale = this.translocoService.getActiveLang();
    const translation = this.pokemon.translations?.find(t => t.locale === locale);
    return translation?.category || this.pokemon.category || '';
  }
  
getAbilityTranslation(ability: Abilities, key: 'name' | 'description'): string {
  const locale = this.translocoService.getActiveLang();
//  console.log('Current locale:', locale);
 // console.log('Ability translations:', ability.translations);

  const translation = ability.translations?.find((t: AbilityTranslation) => t.locale === locale);
 // console.log('Found translation:', translation);

  return translation?.[key] || ability[key] || '';
}

}
