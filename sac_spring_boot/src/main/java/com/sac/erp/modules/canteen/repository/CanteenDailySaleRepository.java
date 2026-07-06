package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenDailySale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface CanteenDailySaleRepository extends JpaRepository<CanteenDailySale, Long> {
    Optional<CanteenDailySale> findBySaleDate(LocalDate saleDate);
}
