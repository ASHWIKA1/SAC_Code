package com.sac.erp.modules.jitsi.service;

import com.sac.erp.modules.jitsi.entity.*;
import java.util.List;

public interface JitsiService {
    JitsiSetting getJitsiSetting();
    JitsiSetting saveJitsiSetting(JitsiSetting setting);

    List<JitsiMeeting> getAllMeetings();
    JitsiMeeting scheduleMeeting(JitsiMeeting meeting);

    List<JitsiVirtualClass> getVirtualClasses(Integer classId, String sectionId);
    JitsiVirtualClass scheduleVirtualClass(JitsiVirtualClass virtualClass);

    List<JitsiMeetingUser> getMeetingUsers(Integer meetingId);
    JitsiMeetingUser addMeetingUser(JitsiMeetingUser meetingUser);
}
