package com.sac.erp.modules.dormitory.repository;

import com.sac.erp.modules.dormitory.entity.DormitoryList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DormitoryListRepository extends JpaRepository<DormitoryList, Long> {
    List<DormitoryList> findByActiveStatus(Integer activeStatus);
}
