export interface Historico {
  id: number;
  itemId: number;
  funcionarioId: number;
  dataInicio: string;
  dataFim: string | null;
}

export interface HistoricoFormatado {
  nomeItem: string;
  nomeFuncionario: string;
  funcionarioId: number;
  dataInicio: string;
  dataFim: string | null;
}

