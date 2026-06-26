package com.sac.erp.modules.finance.service;

import com.sac.erp.modules.finance.entity.*;
import java.util.List;

public interface FinanceService {
    List<BankAccount> getAllBankAccounts();
    BankAccount createBankAccount(BankAccount bankAccount);

    List<ChartOfAccount> getAllChartOfAccounts();
    List<ChartOfAccount> getChartOfAccountsByType(String type);
    ChartOfAccount createChartOfAccount(ChartOfAccount chartOfAccount);

    List<Income> getAllIncomes();
    Income addIncome(Income income);

    List<Expense> getAllExpenses();
    Expense addExpense(Expense expense);
}
