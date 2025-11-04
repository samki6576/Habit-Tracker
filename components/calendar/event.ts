export interface Event {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  color?: string;
}