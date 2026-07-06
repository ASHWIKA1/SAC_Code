package com.sac.erp.modules.jitsi.repository;

import com.sac.erp.modules.jitsi.entity.JitsiVirtualClassTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JitsiVirtualClassTeacherRepository extends JpaRepository<JitsiVirtualClassTeacher, Long> {
    List<JitsiVirtualClassTeacher> findByMeetingId(Long meetingId);
}
