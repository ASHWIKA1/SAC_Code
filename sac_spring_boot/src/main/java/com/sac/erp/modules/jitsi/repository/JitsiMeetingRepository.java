package com.sac.erp.modules.jitsi.repository;

import com.sac.erp.modules.jitsi.entity.JitsiMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JitsiMeetingRepository extends JpaRepository<JitsiMeeting, Long> {
}
