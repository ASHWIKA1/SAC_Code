package com.sac.erp.modules.zoom.service;

import com.sac.erp.modules.zoom.entity.ZoomMeeting;
import com.sac.erp.modules.zoom.entity.ZoomSetting;
import com.sac.erp.modules.zoom.entity.ZoomVirtualClass;

import java.util.List;

public interface ZoomService {
    // Meetings
    List<ZoomMeeting> getAllMeetings();
    ZoomMeeting getMeetingById(Long id);
    ZoomMeeting createMeeting(ZoomMeeting meeting);
    ZoomMeeting updateMeeting(Long id, ZoomMeeting meeting);
    void deleteMeeting(Long id);
    List<ZoomMeeting> getMeetingsByClassSection(Long classId, Long sectionId);

    // Virtual Classes
    List<ZoomVirtualClass> getAllVirtualClasses();
    ZoomVirtualClass getVirtualClassById(Long id);
    ZoomVirtualClass createVirtualClass(ZoomVirtualClass virtualClass);
    ZoomVirtualClass updateVirtualClass(Long id, ZoomVirtualClass virtualClass);
    void deleteVirtualClass(Long id);

    // Settings
    ZoomSetting getSettings();
    ZoomSetting saveSettings(ZoomSetting setting);
}
