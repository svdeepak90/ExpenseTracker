import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';
import { CurrencyService } from '../../services/currency.service';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
    selector: 'app-expense-list',
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

  constructor(private expenseService: ExpenseService, public currencyService: CurrencyService) {}

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

  exportToCSV() {
    const csvData = this.filteredExpenses.map(e => ({
      Date: new Date(e.date).toLocaleDateString(),
      Title: e.title,
      Category: e.category,
      Amount: e.amount
    }));
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'expenses.csv');
  }

  exportToExcel() {
    const excelData = this.filteredExpenses.map(e => ({
      Date: new Date(e.date).toLocaleDateString(),
      Title: e.title,
      Category: e.category,
      Amount: e.amount
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'expenses.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Expense Report', 14, 15);
    
    const tableData = this.filteredExpenses.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.title,
      e.category,
      `$${e.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Date', 'Title', 'Category', 'Amount']],
      body: tableData,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save('expenses.pdf');
  }
}
