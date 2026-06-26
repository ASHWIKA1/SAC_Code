package com.sac.erp.modules.cms.repository;

import com.sac.erp.modules.cms.entity.PhotoGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoGalleryRepository extends JpaRepository<PhotoGallery, Long> {
}
