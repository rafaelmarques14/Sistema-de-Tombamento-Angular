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

  // "Memória" reativa que guarda a lista de itens e notifica os componentes sobre as mudanças.
  private itens$ = new BehaviorSubject<Item[]>([]);

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE ESTADO E NOTIFICAÇÃO (REATIVOS) ---

  /**
   * Retorna um Observable que os componentes podem "ouvir" para receber a lista de itens atualizada.
   */
  getItensState(): Observable<Item[]> {
    return this.itens$.asObservable();
  }

  /**
   * Busca a lista mais recente de itens da API e notifica todos os componentes inscritos.
   */
  fetchAndNotifyItens(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/itens`).pipe(
      tap(itens => this.itens$.next(itens))
    );
  }

  // --- MÉTODOS DE CRUD E LÓGICA DE NEGÓCIO PARA ITENS ---

  /**
   * Atribui um item a um funcionário, criando um novo registo de histórico.
   */
  atribuirItem(itemId: number, funcionarioId: number): Observable<any> {
    const novoHistorico = {
      itemId: itemId,
      funcionarioId: funcionarioId,
      dataInicio: new Date().toISOString(),
      dataFim: null
    };
    
    // 1. Cria o novo registo de histórico
    return this.http.post<Historico>(`${this.apiUrl}/historico`, novoHistorico).pipe(
      // 2. Após criar o histórico, atualiza o item com o status e o ID do novo histórico
      switchMap(historicoCriado => {
        const patchData = {
          funcionarioId: funcionarioId,
          status: 'Em uso' as const,
          historicoIdAtivo: historicoCriado.id
        };
        return this.http.patch<Item>(`${this.apiUrl}/itens/${itemId}`, patchData);
      }),
      // 3. Finalmente, busca a lista de itens atualizada para notificar toda a aplicação
      tap(() => this.fetchAndNotifyItens().subscribe())
    );
  }

  /**
   * Desatribui um item, finalizando o registo de histórico ativo.
   */
  desatribuirItem(item: Item): Observable<any> {
    const patchHistorico = {
      dataFim: new Date().toISOString()
    };

    // 1. Finaliza o registo de histórico ativo, adicionando a data de fim
    return this.http.patch<Historico>(`${this.apiUrl}/historico/${item.historicoIdAtivo}`, patchHistorico).pipe(
      // 2. Após finalizar o histórico, atualiza o item para o estado "Livre"
      switchMap(() => {
        const patchItem = {
          funcionarioId: null,
          status: 'Livre' as const,
          historicoIdAtivo: null
        };
        return this.http.patch<Item>(`${this.apiUrl}/itens/${item.id}`, patchItem);
      }),
      // 3. Finalmente, busca a lista de itens atualizada para notificar toda a aplicação
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

  // --- MÉTODOS PARA HISTÓRICO ---

  /**
   * Busca os 5 registos de histórico mais recentes para o widget do dashboard.
   */
  getHistoricoRecente(): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.apiUrl}/historico?_sort=dataInicio&_order=desc&_limit=5`);
  }
  
  /**
   * Busca o histórico completo para a página de relatório.
   */
  getHistoricoCompleto(): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.apiUrl}/historico?_sort=dataInicio&_order=desc`);
  }

  // --- MÉTODOS DE CRUD PARA FUNCIONÁRIOS ---

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

