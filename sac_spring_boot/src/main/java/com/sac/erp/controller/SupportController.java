package com.sac.erp.controller;

import com.sac.erp.entity.Language;
import com.sac.erp.entity.TwoFactorSetting;
import com.sac.erp.modules.finance.entity.Transcation;
import com.sac.erp.repository.LanguageRepository;
import com.sac.erp.repository.TwoFactorSettingRepository;
import com.sac.erp.modules.finance.repository.TranscationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
public class SupportController {

    private final LanguageRepository languageRepository;
    private final TwoFactorSettingRepository twoFactorSettingRepository;
    private final TranscationRepository transcationRepository;

    // Languages
    @GetMapping("/languages")
    public ResponseEntity<List<Language>> getLanguages() {
        return ResponseEntity.ok(languageRepository.findAll());
    }

    @PostMapping("/languages")
    public ResponseEntity<Language> saveLanguage(@RequestBody Language language) {
        return ResponseEntity.ok(languageRepository.save(language));
    }

    // Two Factor
    @GetMapping("/two-factor")
    public ResponseEntity<TwoFactorSetting> getTwoFactor() {
        return ResponseEntity.ok(twoFactorSettingRepository.findAll().stream().findFirst().orElseGet(() -> {
            TwoFactorSetting tfs = new TwoFactorSetting();
            return twoFactorSettingRepository.save(tfs);
        }));
    }

    @PostMapping("/two-factor")
    public ResponseEntity<TwoFactorSetting> saveTwoFactor(@RequestBody TwoFactorSetting setting) {
        return ResponseEntity.ok(twoFactorSettingRepository.save(setting));
    }

    // Transcations
    @GetMapping("/transactions")
    public ResponseEntity<List<Transcation>> getTransactions(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(transcationRepository.findByUserId(userId));
        }
        return ResponseEntity.ok(transcationRepository.findAll());
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transcation> saveTransaction(@RequestBody Transcation transcation) {
        return ResponseEntity.ok(transcationRepository.save(transcation));
    }
}
