package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.LmsForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LmsForumPostRepository extends JpaRepository<LmsForumPost, Long> {
    List<LmsForumPost> findByForumId(Long forumId);
}
