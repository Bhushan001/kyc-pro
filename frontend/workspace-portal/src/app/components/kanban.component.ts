import { Component } from '@angular/core';

@Component({
  selector: 'app-kanban',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Kanban Board</h2>
    <p>Drag and drop your tasks to track progress.</p>
  `
})
export class KanbanComponent {}
