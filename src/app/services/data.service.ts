import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import { Item } from '../models/item.model';
import { Funcionario } from '../models/funcionario.model';
import { Historico } from '../models/historico.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  private itens$ = new BehaviorSubject<Item[]>([]);

  constructor(private http: HttpClient) { }

  getItensState(): Observable<Item[]> {
    return this.itens$.asObservable();
  }

  fetchAndNotifyItens(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/itens`).pipe(
      tap(itens => this.itens$.next(itens))
    );
  }

  atribuirItem(itemId: number, funcionarioId: number): Observable<any> {
    const novoHistorico = {
      itemId: itemId,
      funcionarioId: funcionarioId,
      dataInicio: new Date().toISOString(),
      dataFim: null
    };
    
    return this.http.post<Historico>(`${this.apiUrl}/historico`, novoHistorico).pipe(
      
      switchMap(historicoCriado => {
        const patchData = {
          funcionarioId: funcionarioId,
          status: 'Em uso' as const,
          historicoIdAtivo: historicoCriado.id
        };
        return this.http.patch<Item>(`${this.apiUrl}/itens/${itemId}`, patchData);
      }),

      tap(() => this.fetchAndNotifyItens().subscribe())
    );
  }

  desatribuirItem(item: Item): Observable<any> {
    const patchHistorico = {
      dataFim: new Date().toISOString()
    };

    return this.http.patch<Historico>(`${this.apiUrl}/historico/${item.historicoIdAtivo}`, patchHistorico).pipe(

      switchMap(() => {
        const patchItem = {
          funcionarioId: null,
          status: 'Livre' as const,
          historicoIdAtivo: null
        };
        return this.http.patch<Item>(`${this.apiUrl}/itens/${item.id}`, patchItem);
      }),

      tap(() => this.fetchAndNotifyItens().subscribe())
    );
  }

  addItem(item: Omit<Item, 'id'>): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/itens`, item).pipe(
      tap(() => this.fetchAndNotifyItens().subscribe())
    );
  }

  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/itens/${item.id}`, item).pipe(
      tap(() => this.fetchAndNotifyItens().subscribe())
    );
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/itens/${id}`).pipe(
      tap(() => this.fetchAndNotifyItens().subscribe())
    );
  }


 getHistoricoRecente(): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.apiUrl}/historico?_sort=dataInicio&_order=desc&_limit=30`);
  }

  getHistoricoCompleto(): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.apiUrl}/historico?_sort=dataInicio&_order=desc`);
  }


  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.apiUrl}/funcionarios`);
  }
  
  addFuncionario(funcionario: Omit<Funcionario, 'id'>): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.apiUrl}/funcionarios`, funcionario);
  }

  updateFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/funcionarios/${funcionario.id}`, funcionario);
  }

  deleteFuncionario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/funcionarios/${id}`);
  }
}

