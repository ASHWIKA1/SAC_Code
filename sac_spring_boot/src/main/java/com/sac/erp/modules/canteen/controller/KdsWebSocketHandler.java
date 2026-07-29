package com.sac.erp.modules.canteen.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class KdsWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/order-update")
    @SendTo("/topic/canteen")
    public Map<String, Object> broadcastOrderUpdate(Map<String, Object> message) {
        log.info("Received order status update via STOMP: {}", message);
        return message;
    }

    public void sendEvent(String eventType, Object payload) {
        log.info("Broadcasting event: {} to /topic/canteen", eventType);
        messagingTemplate.convertAndSend("/topic/canteen", Map.of(
            "type", eventType,
            "data", payload
        ));
    }
}
