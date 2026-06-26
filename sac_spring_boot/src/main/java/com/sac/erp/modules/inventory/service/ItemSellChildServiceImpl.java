package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemSellChild;
import com.sac.erp.modules.inventory.repository.ItemSellChildRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemSellChildServiceImpl implements ItemSellChildService {

    private final ItemSellChildRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemSellChild> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemSellChild getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemSellChild not found with id: " + id));
    }

    @Override
    @Transactional
    public ItemSellChild create(ItemSellChild entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public ItemSellChild update(Long id, ItemSellChild entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ItemSellChild existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
