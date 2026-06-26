package com.sac.erp.modules.jitsi.repository;

import com.sac.erp.modules.jitsi.entity.JitsiMeetingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JitsiMeetingUserRepository extends JpaRepository<JitsiMeetingUser, Long> {
    List<JitsiMeetingUser> findByMeetingId(Integer meetingId);
}
