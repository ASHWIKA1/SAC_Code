package com.sac.erp.modules.zoom.repository;

import com.sac.erp.modules.zoom.entity.ZoomMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoomMeetingRepository extends JpaRepository<ZoomMeeting, Long> {
    List<ZoomMeeting> findByStatus(Integer status);
    List<ZoomMeeting> findByClassIdAndSectionId(Long classId, Long sectionId);
}
