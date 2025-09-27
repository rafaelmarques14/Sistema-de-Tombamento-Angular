import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Item } from '../models/item.model';
import { Funcionario } from '../models/funcionario.model';

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
      tap(itens => {
        this.itens$.next(itens); 
      })
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

  atribuirItem(itemId: number, funcionarioId: number): Observable<Item> {
    const patchData = { funcionarioId: funcionarioId, status: 'Em uso' as const };
    return this.http.patch<Item>(`${this.apiUrl}/itens/${itemId}`, patchData).pipe(
      tap(() => this.fetchAndNotifyItens().subscribe())
    );
  }

  desatribuirItem(itemId: number): Observable<Item> {
    const patchData = { funcionarioId: null, status: 'Livre' as const };
    return this.http.patch<Item>(`${this.apiUrl}/itens/${itemId}`, patchData).pipe(
      tap(() => this.fetchAndNotifyItens().subscribe())
    );
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