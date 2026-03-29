package com.example.expensetracker.service;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.model.ExpenseDto;
import com.example.expensetracker.model.User;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public List<ExpenseDto> getAllExpensesForCurrentUser() {
        User user = getCurrentUser();
        return expenseRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ExpenseDto addExpense(ExpenseDto expenseDto) {
        User user = getCurrentUser();
        Expense expense = Expense.builder()
                .title(expenseDto.getTitle())
                .amount(expenseDto.getAmount())
                .category(expenseDto.getCategory())
                .date(expenseDto.getDate())
                .notes(expenseDto.getNotes())
                .user(user)
                .build();
        
        Expense savedExpense = expenseRepository.save(expense);
        return mapToDto(savedExpense);
    }

    public ExpenseDto updateExpense(Long id, ExpenseDto expenseDto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        validateOwnership(expense);

        expense.setTitle(expenseDto.getTitle());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setDate(expenseDto.getDate());
        expense.setNotes(expenseDto.getNotes());

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToDto(updatedExpense);
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        validateOwnership(expense);
        expenseRepository.delete(expense);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void validateOwnership(Expense expense) {
        User user = getCurrentUser();
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this expense");
        }
    }

    private ExpenseDto mapToDto(Expense expense) {
        return ExpenseDto.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .date(expense.getDate())
                .notes(expense.getNotes())
                .build();
    }
}
