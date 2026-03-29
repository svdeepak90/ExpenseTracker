import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  totalExpenses: number = 0;
  recentExpenses: Expense[] = [];
  
  categories: {name: string, total: number}[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.calculateSummary();
      },
      error: (err) => console.error(err)
    });
  }

  calculateSummary() {
    this.totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    this.recentExpenses = this.expenses.slice(0, 5); // Assuming already sorted date desc from API

    const categoryMap = new Map<string, number>();
    this.expenses.forEach(exp => {
      categoryMap.set(exp.category, (categoryMap.get(exp.category) || 0) + exp.amount);
    });

    this.categories = Array.from(categoryMap.entries()).map(([name, total]) => ({name, total}))
                           .sort((a, b) => b.total - a.total);
  }
}
