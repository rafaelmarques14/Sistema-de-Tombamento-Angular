export interface Item {
  id: number;
  nomeDoItem: string;
  modelo: string;
  marca: string;
  numeroDeTombamento: string;
  status: 'Livre' | 'Em uso' | 'Manutenção';
  funcionarioId?: number | null;
}