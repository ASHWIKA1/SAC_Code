package com.sac.erp.modules.download.repository;

import com.sac.erp.modules.download.entity.DownloadContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadContentTypeRepository extends JpaRepository<DownloadContentType, Long> {

    List<DownloadContentType> findBySchoolIdAndIsActiveTrueOrderByNameAsc(String schoolId);
}
