import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';
import { PokemonCardComponent } from './shared/layouts/pokemon-card/pokemon-card.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { LangSelectorComponent } from './shared/layouts/lang-selector/lang-selector.component';
import { CommonModule } from '@angular/common';
import { TranslocoRootModule } from './transloco-root.module';
import { FormsModule } from '@angular/forms';
import { LearnMoveComponent } from './shared/layouts/learn-move/learn-move.component';
import { LoginComponent } from './pages/login/login.component';
import { SearchPokemonComponent } from './pages/search-pokemon/search-pokemon.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    AppComponent,
    PokemonListComponent,
    PokemonCardComponent,
    PokemonDetailComponent,
    LangSelectorComponent,
    LearnMoveComponent,
    LoginComponent,
    SearchPokemonComponent,
    SearchResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslocoRootModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }