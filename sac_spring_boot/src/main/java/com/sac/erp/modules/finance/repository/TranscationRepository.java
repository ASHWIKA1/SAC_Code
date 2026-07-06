package com.sac.erp.modules.finance.repository;

import com.sac.erp.modules.finance.entity.Transcation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TranscationRepository extends JpaRepository<Transcation, Long> {
    List<Transcation> findByUserId(Long userId);
}
