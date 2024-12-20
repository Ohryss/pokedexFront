import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  searchResults: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  showMenuPopup: boolean = false;
  showFilterPopup: boolean = false;

  types: any[] = []; // Liste des types pour le filtre
  selectedType: number | null = null; // Type sélectionné

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTypes();
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['query'] || '';
      this.resetSearch();
    });
  }

  resetSearch(): void {
    this.searchResults = [];
    this.fetchSearchResults();
  }

  fetchSearchResults(): void {
    this.isLoading = true;

    const params: any = { query: this.searchTerm };
    if (this.selectedType) params.type = this.selectedType; // Ajout du type sélectionné dans les paramètres

    this.apiService
      .requestApi(`/pokemon/search`, 'GET', params)
      .then(response => this.searchResults = response.data || [])
      .finally(() => this.isLoading = false);
  }

  toggleMenuPopup(): void {
    this.showMenuPopup = !this.showMenuPopup;
    if (this.showMenuPopup) this.showFilterPopup = false;
  }

  toggleFilterPopup(): void {
    this.showFilterPopup = !this.showFilterPopup;
    if (this.showFilterPopup) this.showMenuPopup = false;
  }

  applyFilter(): void {
    this.showFilterPopup = false; // Ferme le popup
    this.resetSearch(); // Relance la recherche avec le filtre appliqué
  }

  onBackdropClick(event: MouseEvent, popupType: string): void {
    const target = event.target as HTMLElement;
    if (popupType === 'menu' && target.classList.contains('profile-popup')) {
      this.toggleMenuPopup();
    } else if (popupType === 'filter' && target.classList.contains('filter-popup')) {
      this.toggleFilterPopup();
    }
  }

  loadTypes(): void {
    this.apiService.requestApi('/types', 'GET').then(data => this.types = data); // Charge les types
  }

  logout(): void {
    this.apiService.logout();
  }
}
