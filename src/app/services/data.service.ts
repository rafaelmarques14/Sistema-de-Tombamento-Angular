import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Item } from '../models/item.model';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    deleteFuncionario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/funcionarios/${id}`);
  }
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getItens(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/itens`);
  }

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.apiUrl}/funcionarios`);
  }

  atribuirItem(itemId: number, funcionarioId: number): Observable<Item> {
    const patchData = {
      funcionarioId: funcionarioId,
      status: 'Em uso'
    };
   
    return this.http.patch<Item>(`${this.apiUrl}/itens/${itemId}`, patchData);
  }

  desatribuirItem(itemId: number): Observable<Item> {
    const patchData = {
      funcionarioId: null,
      status: 'Livre'
    };
    
    return this.http.patch<Item>(`${this.apiUrl}/itens/${itemId}`, patchData);
  }

  addFuncionario(funcionario: Omit<Funcionario, 'id'>): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.apiUrl}/funcionarios`, funcionario);
  }

  updateFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/funcionarios/${funcionario.id}`, funcionario);
  }

}