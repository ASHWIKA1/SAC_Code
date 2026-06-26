package com.sac.erp.modules.videowatch.repository;

import com.sac.erp.modules.videowatch.entity.VideoWatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoWatchRepository extends JpaRepository<VideoWatch, Long> {

    List<VideoWatch> findBySchoolIdAndIsActiveTrueOrderByCreatedAtDesc(String schoolId);

    List<VideoWatch> findBySchoolIdAndClassIdAndIsActiveTrueOrderByCreatedAtDesc(String schoolId, Long classId);

    List<VideoWatch> findBySchoolIdAndSubjectIdAndIsActiveTrueOrderByCreatedAtDesc(String schoolId, Long subjectId);
}
