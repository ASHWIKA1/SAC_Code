package com.sac.erp.modules.zoom.service;

import com.sac.erp.modules.zoom.entity.ZoomMeeting;
import com.sac.erp.modules.zoom.entity.ZoomSetting;
import com.sac.erp.modules.zoom.entity.ZoomVirtualClass;
import com.sac.erp.modules.zoom.repository.ZoomMeetingRepository;
import com.sac.erp.modules.zoom.repository.ZoomSettingRepository;
import com.sac.erp.modules.zoom.repository.ZoomVirtualClassRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ZoomServiceImpl implements ZoomService {

    private final ZoomMeetingRepository meetingRepository;
    private final ZoomVirtualClassRepository virtualClassRepository;
    private final ZoomSettingRepository settingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ZoomMeeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ZoomMeeting getMeetingById(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zoom meeting not found: " + id));
    }

    @Override
    @Transactional
    public ZoomMeeting createMeeting(ZoomMeeting meeting) {
        log.info("Creating Zoom meeting: {}", meeting.getTopic());
        return meetingRepository.save(meeting);
    }

    @Override
    @Transactional
    public ZoomMeeting updateMeeting(Long id, ZoomMeeting updated) {
        ZoomMeeting existing = getMeetingById(id);
        existing.setTopic(updated.getTopic());
        existing.setDescription(updated.getDescription());
        existing.setDateOfMeeting(updated.getDateOfMeeting());
        existing.setTimeOfMeeting(updated.getTimeOfMeeting());
        existing.setMeetingDuration(updated.getMeetingDuration());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setTimeBeforeStart(updated.getTimeBeforeStart());
        existing.setIsRecurring(updated.getIsRecurring());
        existing.setStatus(updated.getStatus());
        return meetingRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteMeeting(Long id) {
        meetingRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ZoomMeeting> getMeetingsByClassSection(Long classId, Long sectionId) {
        return meetingRepository.findByClassIdAndSectionId(classId, sectionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ZoomVirtualClass> getAllVirtualClasses() {
        return virtualClassRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ZoomVirtualClass getVirtualClassById(Long id) {
        return virtualClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zoom virtual class not found: " + id));
    }

    @Override
    @Transactional
    public ZoomVirtualClass createVirtualClass(ZoomVirtualClass virtualClass) {
        log.info("Creating Zoom virtual class: {}", virtualClass.getTopic());
        return virtualClassRepository.save(virtualClass);
    }

    @Override
    @Transactional
    public ZoomVirtualClass updateVirtualClass(Long id, ZoomVirtualClass updated) {
        ZoomVirtualClass existing = getVirtualClassById(id);
        existing.setTopic(updated.getTopic());
        existing.setDescription(updated.getDescription());
        existing.setClassId(updated.getClassId());
        existing.setSectionId(updated.getSectionId());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setStatus(updated.getStatus());
        return virtualClassRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteVirtualClass(Long id) {
        virtualClassRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ZoomSetting getSettings() {
        return settingRepository.findFirstBy().orElse(new ZoomSetting());
    }

    @Override
    @Transactional
    public ZoomSetting saveSettings(ZoomSetting setting) {
        return settingRepository.save(setting);
    }
}
