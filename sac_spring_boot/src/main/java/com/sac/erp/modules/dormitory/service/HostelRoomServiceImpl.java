package com.sac.erp.modules.dormitory.service;

import com.sac.erp.modules.dormitory.entity.HostelRoom;
import com.sac.erp.modules.dormitory.repository.HostelRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HostelRoomServiceImpl implements HostelRoomService {

    private final HostelRoomRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<HostelRoom> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public HostelRoom getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("HostelRoom not found with id: " + id));
    }

    @Override
    @Transactional
    public HostelRoom create(HostelRoom entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public HostelRoom update(Long id, HostelRoom entity) {
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
