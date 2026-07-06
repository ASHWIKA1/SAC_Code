package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.PhotoGallery;
import java.util.List;

public interface PhotoGalleryService {
    List<PhotoGallery> getAll();
    PhotoGallery getById(Long id);
    PhotoGallery create(PhotoGallery entity);
    PhotoGallery update(Long id, PhotoGallery entity);
    void delete(Long id);
}
