package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.GoodsReceiptNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, Long> {
    List<GoodsReceiptNote> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);
}
