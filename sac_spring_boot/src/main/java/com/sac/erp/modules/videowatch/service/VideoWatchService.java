package com.sac.erp.modules.videowatch.service;

import com.sac.erp.modules.videowatch.entity.VideoWatch;

import java.util.List;

public interface VideoWatchService {
    List<VideoWatch> getActiveVideos(String schoolId);
    List<VideoWatch> getVideosByClass(String schoolId, Long classId);
    List<VideoWatch> getVideosBySubject(String schoolId, Long subjectId);
    VideoWatch getVideoById(Long id, String schoolId);
    VideoWatch createVideo(VideoWatch video, Long userId, String schoolId);
    VideoWatch updateVideo(Long id, VideoWatch videoDetails, String schoolId);
    void deleteVideo(Long id, String schoolId);
    VideoWatch incrementWatchCount(Long id, String schoolId);
}
