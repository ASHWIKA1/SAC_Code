package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemSell;
import com.sac.erp.modules.inventory.repository.ItemSellRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemSellServiceImpl implements ItemSellService {

    private final ItemSellRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemSell> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemSell getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemSell not found with id: " + id));
    }

    @Override
    @Transactional
    public ItemSell create(ItemSell entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public ItemSell update(Long id, ItemSell entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ItemSell existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
