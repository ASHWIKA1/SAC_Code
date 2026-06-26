package com.sac.erp;

import com.sac.erp.modules.finance.entity.BankAccount;
import com.sac.erp.modules.finance.entity.Expense;
import com.sac.erp.modules.finance.entity.Income;
import com.sac.erp.modules.finance.repository.BankAccountRepository;
import com.sac.erp.modules.finance.repository.ChartOfAccountRepository;
import com.sac.erp.modules.finance.repository.ExpenseRepository;
import com.sac.erp.modules.finance.repository.IncomeRepository;
import com.sac.erp.modules.finance.service.FinanceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class FinanceServiceTest {

    @Mock
    private BankAccountRepository bankAccountRepository;
    @Mock
    private ChartOfAccountRepository chartOfAccountRepository;
    @Mock
    private IncomeRepository incomeRepository;
    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private FinanceServiceImpl financeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddIncome_UpdatesBankBalance() {
        BankAccount account = new BankAccount();
        account.setId(1L);
        account.setCurrentBalance(1000.0);

        Income income = new Income();
        income.setAmount(250.0);
        income.setBankAccountId(1L);

        when(bankAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(bankAccountRepository.save(any(BankAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(incomeRepository.save(any(Income.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Income saved = financeService.addIncome(income);

        assertNotNull(saved);
        assertEquals(1250.0, account.getCurrentBalance()); // 1000 + 250
        verify(bankAccountRepository, times(1)).save(account);
    }

    @Test
    void testAddExpense_UpdatesBankBalance() {
        BankAccount account = new BankAccount();
        account.setId(1L);
        account.setCurrentBalance(1000.0);

        Expense expense = new Expense();
        expense.setAmount(300.0);
        expense.setBankAccountId(1L);

        when(bankAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(bankAccountRepository.save(any(BankAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(expenseRepository.save(any(Expense.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Expense saved = financeService.addExpense(expense);

        assertNotNull(saved);
        assertEquals(700.0, account.getCurrentBalance()); // 1000 - 300
        verify(bankAccountRepository, times(1)).save(account);
    }

    @Test
    void testAddExpense_InsufficientFunds() {
        BankAccount account = new BankAccount();
        account.setId(1L);
        account.setCurrentBalance(100.0); // Only 100

        Expense expense = new Expense();
        expense.setAmount(300.0); // Demands 300
        expense.setBankAccountId(1L);

        when(bankAccountRepository.findById(1L)).thenReturn(Optional.of(account));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            financeService.addExpense(expense);
        });

        assertTrue(exception.getMessage().contains("Insufficient bank account balance"));
    }
}
