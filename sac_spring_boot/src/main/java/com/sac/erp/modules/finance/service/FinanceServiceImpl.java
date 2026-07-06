package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.*;
import com.sac.erp.modules.finance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceServiceImpl implements FinanceService {

    private final BankAccountRepository bankAccountRepository;
    private final ChartOfAccountRepository chartOfAccountRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BankAccount> getAllBankAccounts() {
        return bankAccountRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public BankAccount createBankAccount(BankAccount bankAccount) {
        if (bankAccount.getCurrentBalance() == null) {
            bankAccount.setCurrentBalance(bankAccount.getOpeningBalance());
        }
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChartOfAccount> getAllChartOfAccounts() {
        return chartOfAccountRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChartOfAccount> getChartOfAccountsByType(String type) {
        return chartOfAccountRepository.findByTypeAndActiveStatus(type, 1);
    }

    @Override
    @Transactional
    public ChartOfAccount createChartOfAccount(ChartOfAccount chartOfAccount) {
        return chartOfAccountRepository.save(chartOfAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Income> getAllIncomes() {
        return incomeRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Income addIncome(Income income) {
        if (income.getDate() == null) {
            income.setDate(java.time.LocalDate.now());
        }
        if (income.getBankAccountId() != null) {
            BankAccount account = bankAccountRepository.findById(income.getBankAccountId())
                    .orElseThrow(() -> new RuntimeException("Bank Account not found"));
            account.setCurrentBalance(account.getCurrentBalance() + income.getAmount());
            bankAccountRepository.save(account);
        }
        return incomeRepository.save(income);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        return expenseRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Expense addExpense(Expense expense) {
        if (expense.getDate() == null) {
            expense.setDate(java.time.LocalDate.now());
        }
        if (expense.getBankAccountId() != null) {
            BankAccount account = bankAccountRepository.findById(expense.getBankAccountId())
                    .orElseThrow(() -> new RuntimeException("Bank Account not found"));
            if (account.getCurrentBalance() < expense.getAmount()) {
                throw new RuntimeException("Insufficient bank account balance");
            }
            account.setCurrentBalance(account.getCurrentBalance() - expense.getAmount());
            bankAccountRepository.save(account);
        }
        return expenseRepository.save(expense);
    }
}
