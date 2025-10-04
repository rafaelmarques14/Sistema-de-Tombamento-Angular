import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map, Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Item } from '../../models/item.model';
import { Funcionario } from '../../models/funcionario.model';
import { Historico } from '../../models/historico.model';

export interface AtividadeFormatada {
  texto: string;
  data: string;
  icone: string;
}

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, DatePipe],
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit {
  atividades$!: Observable<AtividadeFormatada[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.atividades$ = forkJoin({
      historico: this.dataService.getHistoricoRecente(),
      itens: this.dataService.fetchAndNotifyItens(),
      funcionarios: this.dataService.getFuncionarios()
    }).pipe(
      map(({ historico, itens, funcionarios }) => {
        const itemMap = new Map(itens.map(i => [i.id, i.nomeDoItem]));
        const funcMap = new Map(funcionarios.map(f => [f.id, f.nome]));

        const formattedActivities = historico.map(h => {
          const nomeItem = itemMap.get(h.itemId) || 'Item desconhecido';
          const nomeFunc = funcMap.get(h.funcionarioId) || 'Funcionário desconhecido';
          
          if (h.dataFim) {
            return {
              texto: `${nomeItem} foi devolvido por ${nomeFunc}.`,
              data: h.dataFim, 
              icone: 'keyboard_return'
            };
          } else {
            return {
              texto: `${nomeItem} foi atribuído a ${nomeFunc}.`,
              data: h.dataInicio, 
              icone: 'person_add'
            };
          }
        });

        formattedActivities.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        return formattedActivities.slice(0, 5);
      })
    );
  }
}

