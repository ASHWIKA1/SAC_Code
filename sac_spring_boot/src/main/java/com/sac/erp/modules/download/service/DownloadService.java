package com.sac.erp.modules.download.service;

import com.sac.erp.modules.download.entity.DownloadContent;
import com.sac.erp.modules.download.entity.DownloadContentType;

import java.util.List;

public interface DownloadService {
    List<DownloadContent> getActiveDownloads(String schoolId);
    List<DownloadContent> getDownloadsByType(String schoolId, Long contentTypeId);
    DownloadContent getDownloadById(Long id, String schoolId);
    DownloadContent createDownload(DownloadContent content, Long userId, String schoolId);
    DownloadContent updateDownload(Long id, DownloadContent contentDetails, String schoolId);
    void deleteDownload(Long id, String schoolId);
    DownloadContent incrementDownloadCount(Long id, String schoolId);

    List<DownloadContentType> getContentTypes(String schoolId);
    DownloadContentType createContentType(DownloadContentType contentType, String schoolId);
    void deleteContentType(Long id, String schoolId);
}
