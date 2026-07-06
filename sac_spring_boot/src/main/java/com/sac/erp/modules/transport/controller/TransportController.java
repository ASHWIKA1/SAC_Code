package com.sac.erp.modules.transport.controller;

import com.sac.erp.modules.transport.entity.*;
import com.sac.erp.modules.transport.service.TransportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/transport")
@RequiredArgsConstructor
public class TransportController {

    private final TransportService transportService;

    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getRoutes() {
        log.info("REST request to get all active routes");
        return ResponseEntity.ok(transportService.getAllRoutes());
    }

    @PostMapping("/routes")
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        log.info("REST request to define route: {}", route.getRouteTitle());
        return ResponseEntity.ok(transportService.createRoute(route));
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getVehicles() {
        log.info("REST request to get all active vehicles");
        return ResponseEntity.ok(transportService.getAllVehicles());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        log.info("REST request to add vehicle: {}", vehicle.getVehicleNo());
        return ResponseEntity.ok(transportService.createVehicle(vehicle));
    }

    @GetMapping("/assign")
    public ResponseEntity<List<AssignVehicle>> getAssignedVehicles() {
        log.info("REST request to get all active vehicle assignments");
        return ResponseEntity.ok(transportService.getAllAssignedVehicles());
    }

    @PostMapping("/assign")
    public ResponseEntity<AssignVehicle> assignVehicle(
            @RequestParam Long routeId,
            @RequestParam Long vehicleId) {
        log.info("REST request to assign vehicle ID: {} to route ID: {}", vehicleId, routeId);
        return ResponseEntity.ok(transportService.assignVehicle(routeId, vehicleId));
    }
}
