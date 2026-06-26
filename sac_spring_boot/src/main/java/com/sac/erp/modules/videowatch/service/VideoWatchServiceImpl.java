package com.sac.erp.modules.videowatch.service;

import com.sac.erp.modules.videowatch.entity.VideoWatch;
import com.sac.erp.modules.videowatch.repository.VideoWatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VideoWatchServiceImpl implements VideoWatchService {

    private final VideoWatchRepository videoWatchRepository;

    @Override
    @Transactional(readOnly = true)
    public List<VideoWatch> getActiveVideos(String schoolId) {
        return videoWatchRepository.findBySchoolIdAndIsActiveTrueOrderByCreatedAtDesc(schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VideoWatch> getVideosByClass(String schoolId, Long classId) {
        return videoWatchRepository.findBySchoolIdAndClassIdAndIsActiveTrueOrderByCreatedAtDesc(schoolId, classId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VideoWatch> getVideosBySubject(String schoolId, Long subjectId) {
        return videoWatchRepository.findBySchoolIdAndSubjectIdAndIsActiveTrueOrderByCreatedAtDesc(schoolId, subjectId);
    }

    @Override
    @Transactional(readOnly = true)
    public VideoWatch getVideoById(Long id, String schoolId) {
        VideoWatch video = videoWatchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Video watch record not found"));
        if (!video.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Access denied to video record");
        }
        return video;
    }

    @Override
    public VideoWatch createVideo(VideoWatch video, Long userId, String schoolId) {
        video.setSchoolId(schoolId);
        video.setUploadedBy(userId);
        video.setIsActive(true);
        video.setWatchCount(0L);
        return videoWatchRepository.save(video);
    }

    @Override
    public VideoWatch updateVideo(Long id, VideoWatch videoDetails, String schoolId) {
        VideoWatch video = getVideoById(id, schoolId);
        video.setTitle(videoDetails.getTitle());
        video.setVideoUrl(videoDetails.getVideoUrl());
        video.setThumbnailUrl(videoDetails.getThumbnailUrl());
        video.setDescription(videoDetails.getDescription());
        video.setDurationSeconds(videoDetails.getDurationSeconds());
        video.setIsActive(videoDetails.getIsActive());
        video.setClassId(videoDetails.getClassId());
        video.setSubjectId(videoDetails.getSubjectId());
        return videoWatchRepository.save(video);
    }

    @Override
    public void deleteVideo(Long id, String schoolId) {
        VideoWatch video = getVideoById(id, schoolId);
        videoWatchRepository.delete(video);
    }

    @Override
    public VideoWatch incrementWatchCount(Long id, String schoolId) {
        VideoWatch video = getVideoById(id, schoolId);
        video.setWatchCount(video.getWatchCount() + 1);
        return videoWatchRepository.save(video);
    }
}
