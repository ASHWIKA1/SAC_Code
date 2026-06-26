package com.sac.erp.modules.download.service;

import com.sac.erp.modules.download.entity.DownloadContent;
import com.sac.erp.modules.download.entity.DownloadContentType;
import com.sac.erp.modules.download.repository.DownloadContentRepository;
import com.sac.erp.modules.download.repository.DownloadContentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DownloadServiceImpl implements DownloadService {

    private final DownloadContentRepository contentRepository;
    private final DownloadContentTypeRepository typeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DownloadContent> getActiveDownloads(String schoolId) {
        return contentRepository.findBySchoolIdAndIsActiveTrueOrderByCreatedAtDesc(schoolId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DownloadContent> getDownloadsByType(String schoolId, Long contentTypeId) {
        return contentRepository.findBySchoolIdAndContentTypeIdAndIsActiveTrueOrderByCreatedAtDesc(schoolId, contentTypeId);
    }

    @Override
    @Transactional(readOnly = true)
    public DownloadContent getDownloadById(Long id, String schoolId) {
        DownloadContent content = contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Download content not found"));
        if (!content.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Access denied to download content");
        }
        return content;
    }

    @Override
    public DownloadContent createDownload(DownloadContent content, Long userId, String schoolId) {
        content.setSchoolId(schoolId);
        content.setUploadedBy(userId);
        content.setIsActive(true);
        content.setDownloadCount(0L);
        return contentRepository.save(content);
    }

    @Override
    public DownloadContent updateDownload(Long id, DownloadContent contentDetails, String schoolId) {
        DownloadContent content = getDownloadById(id, schoolId);
        content.setTitle(contentDetails.getTitle());
        content.setFilePath(contentDetails.getFilePath());
        content.setFileSize(contentDetails.getFileSize());
        content.setFileType(contentDetails.getFileType());
        content.setIsActive(contentDetails.getIsActive());
        content.setContentTypeId(contentDetails.getContentTypeId());
        content.setDescription(contentDetails.getDescription());
        return contentRepository.save(content);
    }

    @Override
    public void deleteDownload(Long id, String schoolId) {
        DownloadContent content = getDownloadById(id, schoolId);
        contentRepository.delete(content);
    }

    @Override
    public DownloadContent incrementDownloadCount(Long id, String schoolId) {
        DownloadContent content = getDownloadById(id, schoolId);
        content.setDownloadCount(content.getDownloadCount() + 1);
        return contentRepository.save(content);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DownloadContentType> getContentTypes(String schoolId) {
        return typeRepository.findBySchoolIdAndIsActiveTrueOrderByNameAsc(schoolId);
    }

    @Override
    public DownloadContentType createContentType(DownloadContentType contentType, String schoolId) {
        contentType.setSchoolId(schoolId);
        contentType.setIsActive(true);
        return typeRepository.save(contentType);
    }

    @Override
    public void deleteContentType(Long id, String schoolId) {
        DownloadContentType type = typeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content type not found"));
        if (!type.getSchoolId().equals(schoolId)) {
            throw new IllegalArgumentException("Access denied to content type");
        }
        typeRepository.delete(type);
    }
}
