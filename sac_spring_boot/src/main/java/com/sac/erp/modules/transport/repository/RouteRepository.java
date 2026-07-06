package com.sac.erp.modules.transport.repository;

import com.sac.erp.modules.transport.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByActiveStatus(Integer activeStatus);
}
