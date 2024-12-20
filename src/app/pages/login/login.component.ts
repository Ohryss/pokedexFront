import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="  flex flex-col items-center justify-center mt-12">
    <img  class="w-3/12" src="img/logo.webp"  alt="logo de pokeball" />

    <h1 class="text-6xl">Pokédex</h1>
    
      <button class="btn btn-primary bg-zinc-200 px-5 py-2 rounded-3xl mt-10" (click)="login()">Se connecter avec GitHub</button>
    </div>
  `
})

export class LoginComponent {
  constructor(private apiService: ApiService) {}

  async login() {
    await this.apiService.redirectToGithub();
  }
}
