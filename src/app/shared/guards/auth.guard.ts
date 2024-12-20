import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // On attend que l'initialisation soit terminée
    if (!this.apiService.isInit) {
      await new Promise<void>((resolve) => {
        this.apiService.initEvent.subscribe(() => {
          resolve();
        });
      });
    }

    // Si l'utilisateur n'est pas connecté, on le redirige vers /login
    if (!this.apiService.isLogged()) {
      return this.router.createUrlTree(['/login']);
    }

    return true;
  }
}