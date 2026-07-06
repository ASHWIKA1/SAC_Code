package com.sac.erp.modules.chat.controller;

import com.sac.erp.modules.chat.entity.*;
import com.sac.erp.modules.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/status/{userId}")
    public ResponseEntity<ChatStatus> getStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getStatus(userId));
    }

    @PostMapping("/status/{userId}")
    public ResponseEntity<ChatStatus> updateStatus(@PathVariable Long userId, @RequestParam Integer status) {
        return ResponseEntity.ok(chatService.saveStatus(userId, status));
    }

    @PostMapping("/block")
    public ResponseEntity<ChatBlockUser> blockUser(@RequestParam Long blockBy, @RequestParam Long blockTo) {
        try {
            return ResponseEntity.ok(chatService.blockUser(blockBy, blockTo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/unblock")
    public ResponseEntity<Void> unblockUser(@RequestParam Long blockBy, @RequestParam Long blockTo) {
        try {
            chatService.unblockUser(blockBy, blockTo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatConversation> sendMessage(
            @RequestParam Long fromId,
            @RequestParam Long toId,
            @RequestParam String message,
            @RequestParam(required = false, defaultValue = "0") Integer messageType,
            @RequestParam(required = false) String fileName,
            @RequestParam(required = false) String originalFileName) {
        try {
            ChatConversation msg = chatService.sendMessage(fromId, toId, message, messageType, fileName, originalFileName);
            return ResponseEntity.ok(msg);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatConversation>> getMessages(@RequestParam Long user1, @RequestParam Long user2) {
        return ResponseEntity.ok(chatService.getDirectMessages(user1, user2));
    }

    @PostMapping("/groups")
    public ResponseEntity<ChatGroup> createGroup(@RequestBody ChatGroup group) {
        return ResponseEntity.ok(chatService.createGroup(group));
    }

    @GetMapping("/groups/{groupId}/members")
    public ResponseEntity<List<ChatGroupUser>> getGroupMembers(@PathVariable String groupId) {
        return ResponseEntity.ok(chatService.getGroupMembers(groupId));
    }

    @PostMapping("/groups/{groupId}/members")
    public ResponseEntity<ChatGroupUser> addGroupMember(
            @PathVariable String groupId,
            @RequestParam Long userId,
            @RequestParam Long addedBy) {
        return ResponseEntity.ok(chatService.addGroupMember(groupId, userId, addedBy));
    }
}
