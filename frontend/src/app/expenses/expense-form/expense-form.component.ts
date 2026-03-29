import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService, Expense } from '../../services/expense.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent implements OnInit {
  @Input() expense: Expense | null = null;
  @Output() closeForm = new EventEmitter<boolean>();

  expenseForm: FormGroup;
  categories: string[] = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other'];
  isEdit = false;
  showNewCategoryInput = false;

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) {
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['Food', Validators.required],
      newCategory: [''],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.expenseService.getExpenses().subscribe(expenses => {
      const uniqueCats = new Set<string>(this.categories);
      expenses.forEach(e => uniqueCats.add(e.category));
      this.categories = Array.from(uniqueCats);
      if (this.expense && !this.categories.includes(this.expense.category)) {
        this.categories.push(this.expense.category);
      }
    });

    if (this.expense) {
      this.isEdit = true;
      this.expenseForm.patchValue({
        title: this.expense.title,
        amount: this.expense.amount,
        category: this.expense.category,
        date: this.expense.date,
        notes: this.expense.notes
      });
    }
  }

  onCategoryChange(event: any) {
    if (event.target.value === 'ADD_NEW') {
      this.showNewCategoryInput = true;
      this.expenseForm.get('newCategory')?.setValidators([Validators.required]);
    } else {
      this.showNewCategoryInput = false;
      this.expenseForm.get('newCategory')?.clearValidators();
    }
    this.expenseForm.get('newCategory')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const formValue = { ...this.expenseForm.value };
      if (formValue.category === 'ADD_NEW') {
        formValue.category = formValue.newCategory;
      }
      delete formValue.newCategory;

      if (this.isEdit && this.expense?.id) {
        this.expenseService.updateExpense(this.expense.id, formValue).subscribe({
          next: () => this.closeForm.emit(true),
          error: (err) => console.error(err)
        });
      } else {
        this.expenseService.addExpense(formValue).subscribe({
          next: () => this.closeForm.emit(true),
          error: (err) => console.error(err)
        });
      }
    }
  }

  onCancel() {
    this.closeForm.emit(false);
  }
}
