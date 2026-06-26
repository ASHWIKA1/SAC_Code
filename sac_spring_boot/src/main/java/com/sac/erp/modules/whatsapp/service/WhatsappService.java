package com.sac.erp.modules.whatsapp.service;

import com.sac.erp.modules.whatsapp.entity.*;
import com.sac.erp.modules.whatsapp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhatsappService {

    private final WhatsappAgentRepository agentRepository;
    private final WhatsappAgentTimeRepository agentTimeRepository;
    private final WhatsappMessageRepository messageRepository;
    private final WhatsappSettingRepository settingRepository;

    @Transactional(readOnly = true)
    public List<WhatsappAgent> getAllAgents() {
        return agentRepository.findByActiveStatus(1);
    }

    @Transactional
    public WhatsappAgent createAgent(WhatsappAgent agent) {
        return agentRepository.save(agent);
    }

    @Transactional
    public WhatsappAgent updateAgent(Long id, WhatsappAgent updated) {
        WhatsappAgent a = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found: " + id));
        a.setName(updated.getName());
        a.setPhone(updated.getPhone());
        a.setAlwaysAvailable(updated.getAlwaysAvailable());
        a.setActiveStatus(updated.getActiveStatus());
        return agentRepository.save(a);
    }

    @Transactional
    public void deleteAgent(Long id) {
        agentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<WhatsappAgentTime> getAgentTimes(Long agentId) {
        return agentTimeRepository.findByAgentId(agentId);
    }

    @Transactional
    public WhatsappAgentTime saveAgentTime(WhatsappAgentTime agentTime) {
        return agentTimeRepository.save(agentTime);
    }

    @Transactional(readOnly = true)
    public List<WhatsappMessage> getMessages() {
        return messageRepository.findAll();
    }

    @Transactional
    public WhatsappMessage sendMessage(WhatsappMessage message) {
        log.info("Saving WhatsApp message from: {}", message.getSender());
        return messageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public WhatsappSetting getSettings() {
        return settingRepository.findFirstBy().orElse(new WhatsappSetting());
    }

    @Transactional
    public WhatsappSetting saveSettings(WhatsappSetting setting) {
        return settingRepository.save(setting);
    }
}
