package com.sac.erp.modules.wallet.controller;

import com.sac.erp.modules.wallet.entity.WalletSetting;
import com.sac.erp.modules.wallet.entity.WalletTransaction;
import com.sac.erp.modules.wallet.service.WalletService;
import com.sac.erp.modules.core.repository.UserRepository;
import com.sac.erp.modules.core.entity.User;
import com.sac.erp.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping("/my-wallet")
    public ResponseEntity<Map<String, Object>> getMyWallet(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        log.info("Fetching wallet info for user: {} in school: {}", user.getUsername(), schoolId);

        BigDecimal balance = walletService.getWalletBalance(user.getId(), schoolId);
        List<WalletTransaction> history = walletService.getTransactionHistory(user.getId(), schoolId);

        return ResponseEntity.ok(Map.of(
                "balance", balance,
                "history", history
        ));
    }

    @PostMapping("/add")
    public ResponseEntity<WalletTransaction> addWalletAmount(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> request) {
        User user = getAuthenticatedUser(userDetails);
        String schoolId = TenantContext.getCurrentTenant();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String paymentGateway = (String) request.get("paymentGateway");
        String referenceNo = (String) request.get("referenceNo");

        log.info("Initiating wallet deposit of {} for user: {} in school: {}", amount, user.getUsername(), schoolId);
        WalletTransaction transaction = walletService.addWalletAmount(user.getId(), schoolId, amount, paymentGateway, referenceNo);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<WalletTransaction> confirmWalletPayment(
            @RequestBody Map<String, Object> request) {
        Long transactionId = Long.valueOf(request.get("transactionId").toString());
        String schoolId = TenantContext.getCurrentTenant();

        log.info("Confirming wallet payment transaction: {} in school: {}", transactionId, schoolId);
        WalletTransaction transaction = walletService.confirmWalletPayment(transactionId, schoolId);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/settings")
    public ResponseEntity<WalletSetting> getSettings() {
        String schoolId = TenantContext.getCurrentTenant();
        return ResponseEntity.ok(walletService.getWalletSetting(schoolId));
    }

    @PutMapping("/settings")
    public ResponseEntity<WalletSetting> updateSettings(@RequestBody WalletSetting setting) {
        String schoolId = TenantContext.getCurrentTenant();
        setting.setSchoolId(schoolId);
        return ResponseEntity.ok(walletService.saveWalletSetting(setting));
    }
}
