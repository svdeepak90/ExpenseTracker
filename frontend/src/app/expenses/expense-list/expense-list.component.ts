import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, ExpenseFormComponent, FormsModule],
  templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  
  showForm = false;
  selectedExpense: Expense | null = null;
  
  filterCategory = '';
  categories: string[] = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other'];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        
        // Dynamically build category list for filter
        const uniqueCats = new Set<string>(['Food', 'Travel', 'Bills', 'Entertainment', 'Other']);
        this.expenses.forEach(e => uniqueCats.add(e.category));
        this.categories = Array.from(uniqueCats);
        
        this.applyFilter();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter() {
    if (this.filterCategory) {
      this.filteredExpenses = this.expenses.filter(e => e.category === this.filterCategory);
    } else {
      this.filteredExpenses = [...this.expenses];
    }
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => this.loadExpenses(),
        error: (err) => console.error(err)
      });
    }
  }

  openEdit(expense: Expense) {
    this.selectedExpense = expense;
    this.showForm = true;
  }

  openAdd() {
    this.selectedExpense = null;
    this.showForm = true;
  }

  onFormClose(refresh: boolean) {
    this.showForm = false;
    this.selectedExpense = null;
    if (refresh) {
      this.loadExpenses();
    }
  }
}
