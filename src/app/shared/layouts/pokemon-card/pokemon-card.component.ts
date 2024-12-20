import { Component, Input } from '@angular/core';
import { Pokemon } from "../../interfaces/pokemon";
import {TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon: any;

  constructor(private translocoService: TranslocoService) {}

  getPokemonName(): string {
    const currentLang = this.translocoService.getActiveLang();
    const translation = this.pokemon.translations.find((t: any) => t.locale === currentLang);
    return translation ? translation.name || this.pokemon.name : this.pokemon.name;
  }

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

  shadeColor(color: string, percent: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
  
    R = Math.floor(R * (100 + percent) / 100);
    G = Math.floor(G * (100 + percent) / 100);
    B = Math.floor(B * (100 + percent) / 100);
  
    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;
  
    const RR = (R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16);
    const GG = (G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16);
    const BB = (B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16);
  
    return "#" + RR + GG + BB;
  }

  getBackgroundStyle(): string {
    if (this.pokemon && this.pokemon.default_variety && this.pokemon.default_variety.types) {
      const types = this.pokemon.default_variety.types.map((type: any) => type.name.toLowerCase());
  
      if (types.length === 1) {
        const color = this.TYPE_COLORS[types[0]] || '#FFFFFF';
        // console.log('Single type color:', color);
        return color;
      } else if (types.length === 2) {
        const color1 = this.TYPE_COLORS[types[0]] || '#FFFFFF';
        const color2 = this.TYPE_COLORS[types[1]] || '#FFFFFF';
        // console.log('Gradient colors:', color1, color2);
        return `linear-gradient(to top right, ${color1}, ${color2})`;
      }
    }
    // console.log('Default color: #FFFFFF');
    return '#FFFFFF';
  }
  

  getSecondTypeColor(): string {
    if (this.pokemon && this.pokemon.default_variety && this.pokemon.default_variety.types) {
      const types = this.pokemon.default_variety.types.map((type: any) => type.name.toLowerCase());
  
      let color: string;
      if (types.length === 2) {
        color = this.TYPE_COLORS[types[1]] || '#FFFFFF';  // Utilise la couleur du second type
      } else if (types.length === 1) {
        color = this.TYPE_COLORS[types[0]] || '#FFFFFF';  // Utilise la couleur du premier type si pas de second type
      } else {
        color = '#FFFFFF';  // Couleur par défaut
      }
  
      return this.shadeColor(color, -20);  // Assombrit la couleur de 20%
    }
    return '#FFFFFF';  // Couleur par défaut
  }

  
}
