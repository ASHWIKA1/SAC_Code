package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemReceiveChild;
import com.sac.erp.modules.inventory.repository.ItemReceiveChildRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemReceiveChildServiceImpl implements ItemReceiveChildService {

    private final ItemReceiveChildRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemReceiveChild> getAll() {
        return repository.findByActiveStatus(1);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemReceiveChild getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ItemReceiveChild not found with id: " + id));
    }

    @Override
    @Transactional
    public ItemReceiveChild create(ItemReceiveChild entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public ItemReceiveChild update(Long id, ItemReceiveChild entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ItemReceiveChild existing = getById(id);
        existing.setActiveStatus(0);
        repository.save(existing);
    }
}
