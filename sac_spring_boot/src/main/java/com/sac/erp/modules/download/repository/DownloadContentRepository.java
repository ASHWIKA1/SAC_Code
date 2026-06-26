package com.sac.erp.modules.download.repository;

import com.sac.erp.modules.download.entity.DownloadContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadContentRepository extends JpaRepository<DownloadContent, Long> {

    List<DownloadContent> findBySchoolIdAndIsActiveTrueOrderByCreatedAtDesc(String schoolId);

    List<DownloadContent> findBySchoolIdAndContentTypeIdAndIsActiveTrueOrderByCreatedAtDesc(String schoolId, Long contentTypeId);
}
