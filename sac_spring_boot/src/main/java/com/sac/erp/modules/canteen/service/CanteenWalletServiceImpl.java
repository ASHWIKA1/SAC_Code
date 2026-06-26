package com.sac.erp.modules.canteen.service;

import com.sac.erp.modules.canteen.entity.CanteenWallet;
import com.sac.erp.modules.canteen.repository.CanteenWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CanteenWalletServiceImpl implements CanteenWalletService {

    private final CanteenWalletRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<CanteenWallet> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public CanteenWallet getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("CanteenWallet not found with id: " + id));
    }

    @Override
    @Transactional
    public CanteenWallet create(CanteenWallet entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public CanteenWallet update(Long id, CanteenWallet entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
