export interface Consultorio {
  id: number;
  nombre: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  consultorio_id: number;
}