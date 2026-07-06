package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.ItemIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemIssueRepository extends JpaRepository<ItemIssue, Long> {
    List<ItemIssue> findByIssueTo(Long issueTo);
    List<ItemIssue> findByItemIdAndIssueStatus(Long itemId, String issueStatus);
}
