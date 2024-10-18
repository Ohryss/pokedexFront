import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-learn-move',
  templateUrl: './learn-move.component.html',
  styleUrls: ['./learn-move.component.scss']
})
export class LearnMoveComponent implements OnInit {
  @Input() learnMoves: any[] = [];  // Initialisé comme un tableau vide

  constructor() {}

  ngOnInit(): void {}

  // Méthode pour obtenir la traduction appropriée du move
  getTranslation(move: any, locale: string): string {
    const translation = move.translations?.find((t: any) => t.locale === locale);
    return translation ? translation.name : move.name;
  }
}
