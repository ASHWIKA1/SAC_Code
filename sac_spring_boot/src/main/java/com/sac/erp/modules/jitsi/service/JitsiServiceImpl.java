package com.sac.erp.modules.jitsi.service;

import com.sac.erp.modules.jitsi.entity.*;
import com.sac.erp.modules.jitsi.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JitsiServiceImpl implements JitsiService {

    private final JitsiSettingRepository settingRepository;
    private final JitsiMeetingRepository meetingRepository;
    private final JitsiMeetingUserRepository meetingUserRepository;
    private final JitsiVirtualClassRepository virtualClassRepository;
    private final JitsiVirtualClassTeacherRepository virtualClassTeacherRepository;

    @Override
    public JitsiSetting getJitsiSetting() {
        return settingRepository.findAll().stream().findFirst().orElseGet(() -> {
            JitsiSetting js = new JitsiSetting();
            return settingRepository.save(js);
        });
    }

    @Override
    public JitsiSetting saveJitsiSetting(JitsiSetting setting) {
        return settingRepository.save(setting);
    }

    @Override
    public List<JitsiMeeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Override
    public JitsiMeeting scheduleMeeting(JitsiMeeting meeting) {
        return meetingRepository.save(meeting);
    }

    @Override
    public List<JitsiVirtualClass> getVirtualClasses(Integer classId, String sectionId) {
        return virtualClassRepository.findByClassIdAndSectionId(classId, sectionId);
    }

    @Override
    public JitsiVirtualClass scheduleVirtualClass(JitsiVirtualClass virtualClass) {
        return virtualClassRepository.save(virtualClass);
    }

    @Override
    public List<JitsiMeetingUser> getMeetingUsers(Integer meetingId) {
        return meetingUserRepository.findByMeetingId(meetingId);
    }

    @Override
    public JitsiMeetingUser addMeetingUser(JitsiMeetingUser meetingUser) {
        return meetingUserRepository.save(meetingUser);
    }
}
