package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.MediaContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaContentRepository extends JpaRepository<MediaContent, Long> {
    List<MediaContent> findByIsDeleted(Integer isDeleted);
    List<MediaContent> findByStatusAndIsDeleted(Integer status, Integer isDeleted);
}
