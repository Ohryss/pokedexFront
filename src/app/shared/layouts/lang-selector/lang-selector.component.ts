import { Component } from '@angular/core';
import {TranslocoService} from "@jsverse/transloco";

@Component({
        selector: 'app-lang-selector',
        templateUrl: './lang-selector.component.html',
        styleUrl: './lang-selector.component.scss'
})
export class LangSelectorComponent {

    // La langue sélectionnée
    selectedLang!: string;

    constructor(
        public translocoService: TranslocoService // Service de gestion de la traduction Transloco
    ) {
      // Récupération de la langue active
      this.selectedLang = this.translocoService.getActiveLang();
    }
}
