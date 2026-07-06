package com.sac.erp.modules.transport.service;

import com.sac.erp.modules.transport.entity.*;
import com.sac.erp.modules.transport.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransportServiceImpl implements TransportService {

    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final AssignVehicleRepository assignVehicleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Route> getAllRoutes() {
        return routeRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignVehicle> getAllAssignedVehicles() {
        return assignVehicleRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public AssignVehicle assignVehicle(Long routeId, Long vehicleId) {
        // Validate route and vehicle
        routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        AssignVehicle assign = new AssignVehicle();
        assign.setRouteId(routeId);
        assign.setVehicleId(vehicleId);
        assign.setActiveStatus(1);

        return assignVehicleRepository.save(assign);
    }
}
