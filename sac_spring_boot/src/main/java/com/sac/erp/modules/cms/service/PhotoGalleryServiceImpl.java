package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.PhotoGallery;
import com.sac.erp.modules.cms.repository.PhotoGalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoGalleryServiceImpl implements PhotoGalleryService {

    private final PhotoGalleryRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<PhotoGallery> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PhotoGallery getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("PhotoGallery not found with id: " + id));
    }

    @Override
    @Transactional
    public PhotoGallery create(PhotoGallery entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public PhotoGallery update(Long id, PhotoGallery entity) {
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
