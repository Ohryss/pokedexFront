import { Component } from '@angular/core';
import { TranslocoService } from "@jsverse/transloco";

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.scss']
})
export class LangSelectorComponent {
  selectedLang!: string;

  constructor(public translocoService: TranslocoService) {
    // Récupération de la langue sauvegardée ou langue par défaut
    this.selectedLang = localStorage.getItem('lang') || this.translocoService.getActiveLang();
    this.translocoService.setActiveLang(this.selectedLang);
  }

  // Méthode pour changer de langue et sauvegarder
  changeLanguage() {
    this.translocoService.setActiveLang(this.selectedLang);
    localStorage.setItem('lang', this.selectedLang); 
  }
}
