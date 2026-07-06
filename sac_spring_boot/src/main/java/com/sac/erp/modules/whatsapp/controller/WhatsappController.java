package com.sac.erp.modules.whatsapp.controller;

import com.sac.erp.modules.whatsapp.entity.*;
import com.sac.erp.modules.whatsapp.service.WhatsappService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/whatsapp")
@RequiredArgsConstructor
@Tag(name = "WhatsApp Support", description = "WhatsApp Support Agent & Message Management APIs")
public class WhatsappController {

    private final WhatsappService whatsappService;

    @GetMapping("/agents")
    @Operation(summary = "Get all active WhatsApp agents")
    public ResponseEntity<List<WhatsappAgent>> getAgents() {
        return ResponseEntity.ok(whatsappService.getAllAgents());
    }

    @PostMapping("/agents")
    @Operation(summary = "Create a WhatsApp agent")
    public ResponseEntity<WhatsappAgent> createAgent(@RequestBody WhatsappAgent agent) {
        return ResponseEntity.ok(whatsappService.createAgent(agent));
    }

    @PutMapping("/agents/{id}")
    @Operation(summary = "Update a WhatsApp agent")
    public ResponseEntity<WhatsappAgent> updateAgent(@PathVariable Long id, @RequestBody WhatsappAgent agent) {
        return ResponseEntity.ok(whatsappService.updateAgent(id, agent));
    }

    @DeleteMapping("/agents/{id}")
    @Operation(summary = "Delete a WhatsApp agent")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        whatsappService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/agents/{agentId}/times")
    @Operation(summary = "Get agent availability times")
    public ResponseEntity<List<WhatsappAgentTime>> getAgentTimes(@PathVariable Long agentId) {
        return ResponseEntity.ok(whatsappService.getAgentTimes(agentId));
    }

    @PostMapping("/agents/times")
    @Operation(summary = "Save agent availability time slot")
    public ResponseEntity<WhatsappAgentTime> saveAgentTime(@RequestBody WhatsappAgentTime agentTime) {
        return ResponseEntity.ok(whatsappService.saveAgentTime(agentTime));
    }

    @GetMapping("/messages")
    @Operation(summary = "Get all WhatsApp messages")
    public ResponseEntity<List<WhatsappMessage>> getMessages() {
        return ResponseEntity.ok(whatsappService.getMessages());
    }

    @PostMapping("/messages")
    @Operation(summary = "Send / log a WhatsApp message")
    public ResponseEntity<WhatsappMessage> sendMessage(@RequestBody WhatsappMessage message) {
        return ResponseEntity.ok(whatsappService.sendMessage(message));
    }

    @GetMapping("/settings")
    @Operation(summary = "Get WhatsApp settings")
    public ResponseEntity<WhatsappSetting> getSettings() {
        return ResponseEntity.ok(whatsappService.getSettings());
    }

    @PostMapping("/settings")
    @Operation(summary = "Save WhatsApp settings")
    public ResponseEntity<WhatsappSetting> saveSettings(@RequestBody WhatsappSetting setting) {
        return ResponseEntity.ok(whatsappService.saveSettings(setting));
    }
}
