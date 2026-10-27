export type TodoId = number;
export type TodoFilterType = 'all' | 'active' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface ITodoItem {
  id: TodoId;
  title: string;
  completed: boolean;
  createdAt: string;
  priority?: TodoPriority;
}

export type ReadonlyTodoItem = Readonly<ITodoItem>;

export type CreateTodoDto = Pick<ITodoItem, 'title'> & {
  priority?: TodoPriority;
};

export type UpdateTodoDto = Partial<Pick<ITodoItem, 'title' | 'completed' | 'priority'>>;

export type TodoFieldMap<T> = {
  [K in keyof T]: T[K];
};

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
