package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemReceive;
import com.sac.erp.modules.inventory.repository.ItemReceiveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemReceiveServiceImpl implements ItemReceiveService {

    private final ItemReceiveRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemReceive> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemReceive getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemReceive not found with id: " + id));
    }

    @Override
    @Transactional
    public ItemReceive create(ItemReceive entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public ItemReceive update(Long id, ItemReceive entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ItemReceive existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
