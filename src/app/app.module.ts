import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient, HttpClientModule} from "@angular/common/http";
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';
import { PokemonCardComponent } from './shared/layouts/pokemon-card/pokemon-card.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { LangSelectorComponent } from './shared/layouts/lang-selector/lang-selector.component';
import { TranslocoRootModule } from './transloco-root.module'; // Import du provider
import { FormsModule } from '@angular/forms';
import { LearnMoveComponent } from './shared/layouts/learn-move/learn-move.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent,
    PokemonCardComponent,
    PokemonDetailComponent,
    LangSelectorComponent,
    LearnMoveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }