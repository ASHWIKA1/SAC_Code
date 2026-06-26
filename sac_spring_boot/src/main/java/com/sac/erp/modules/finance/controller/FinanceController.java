package com.sac.erp.modules.finance.controller;

import com.sac.erp.modules.finance.entity.*;
import com.sac.erp.modules.finance.service.FinanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @GetMapping("/bank-accounts")
    public ResponseEntity<List<BankAccount>> getBankAccounts() {
        log.info("REST request to get active bank accounts");
        return ResponseEntity.ok(financeService.getAllBankAccounts());
    }

    @PostMapping("/bank-accounts")
    public ResponseEntity<BankAccount> createBankAccount(@RequestBody BankAccount bankAccount) {
        log.info("REST request to create bank account: {}", bankAccount.getBankName());
        return ResponseEntity.ok(financeService.createBankAccount(bankAccount));
    }

    @GetMapping("/chart-of-accounts")
    public ResponseEntity<List<ChartOfAccount>> getChartOfAccounts() {
        log.info("REST request to get active chart of accounts");
        return ResponseEntity.ok(financeService.getAllChartOfAccounts());
    }

    @GetMapping("/chart-of-accounts/type/{type}")
    public ResponseEntity<List<ChartOfAccount>> getChartOfAccountsByType(@PathVariable String type) {
        log.info("REST request to get active chart of accounts of type: {}", type);
        return ResponseEntity.ok(financeService.getChartOfAccountsByType(type));
    }

    @PostMapping("/chart-of-accounts")
    public ResponseEntity<ChartOfAccount> createChartOfAccount(@RequestBody ChartOfAccount chartOfAccount) {
        log.info("REST request to create chart of account: {}", chartOfAccount.getHead());
        return ResponseEntity.ok(financeService.createChartOfAccount(chartOfAccount));
    }

    @GetMapping("/incomes")
    public ResponseEntity<List<Income>> getIncomes() {
        log.info("REST request to get all active incomes");
        return ResponseEntity.ok(financeService.getAllIncomes());
    }

    @PostMapping("/incomes")
    public ResponseEntity<Income> addIncome(@RequestBody Income income) {
        log.info("REST request to record income transaction: {}", income.getName());
        return ResponseEntity.ok(financeService.addIncome(income));
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getExpenses() {
        log.info("REST request to get all active expenses");
        return ResponseEntity.ok(financeService.getAllExpenses());
    }

    @PostMapping("/expenses")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        log.info("REST request to record expense transaction: {}", expense.getName());
        return ResponseEntity.ok(financeService.addExpense(expense));
    }
}
