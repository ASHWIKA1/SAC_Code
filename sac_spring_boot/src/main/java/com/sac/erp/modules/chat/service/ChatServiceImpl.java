package com.sac.erp.modules.chat.service;

import com.sac.erp.modules.chat.entity.*;
import com.sac.erp.modules.chat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatStatusRepository statusRepository;
    private final ChatBlockUserRepository blockUserRepository;
    private final ChatConversationRepository conversationRepository;
    private final ChatGroupRepository groupRepository;
    private final ChatGroupUserRepository groupUserRepository;

    @Override
    public ChatStatus getStatus(Long userId) {
        return statusRepository.findByUserId(userId)
            .orElseGet(() -> {
                ChatStatus cs = new ChatStatus();
                cs.setUserId(userId);
                return statusRepository.save(cs);
            });
    }

    @Override
    @Transactional
    public ChatStatus saveStatus(Long userId, Integer status) {
        ChatStatus cs = getStatus(userId);
        cs.setStatus(status);
        return statusRepository.save(cs);
    }

    @Override
    @Transactional
    public ChatBlockUser blockUser(Long blockBy, Long blockTo) {
        if (blockUserRepository.existsByBlockByAndBlockTo(blockBy, blockTo)) {
            throw new IllegalArgumentException("User is already blocked");
        }
        ChatBlockUser cbu = new ChatBlockUser();
        cbu.setBlockBy(blockBy);
        cbu.setBlockTo(blockTo);
        return blockUserRepository.save(cbu);
    }

    @Override
    @Transactional
    public void unblockUser(Long blockBy, Long blockTo) {
        List<ChatBlockUser> blocks = blockUserRepository.findByBlockBy(blockBy);
        for (ChatBlockUser block : blocks) {
            if (block.getBlockTo().equals(blockTo)) {
                blockUserRepository.delete(block);
                return;
            }
        }
        throw new IllegalArgumentException("Block relationship not found");
    }

    @Override
    public boolean isBlocked(Long user1, Long user2) {
        return blockUserRepository.existsByBlockByAndBlockTo(user1, user2) 
            || blockUserRepository.existsByBlockByAndBlockTo(user2, user1);
    }

    @Override
    @Transactional
    public ChatConversation sendMessage(Long fromId, Long toId, String message, Integer messageType, String fileName, String originalFileName) {
        if (isBlocked(fromId, toId)) {
            throw new IllegalArgumentException("Cannot send message: conversation is blocked");
        }

        ChatConversation conv = new ChatConversation();
        conv.setFromId(fromId);
        conv.setToId(toId);
        conv.setMessage(message);
        conv.setMessageType(messageType != null ? messageType : 0);
        conv.setFileName(fileName);
        conv.setOriginalFileName(originalFileName);
        conv.setStatus(0); // unread
        conv.setInitial(true);

        return conversationRepository.save(conv);
    }

    @Override
    public List<ChatConversation> getDirectMessages(Long user1, Long user2) {
        return conversationRepository.findDirectMessages(user1, user2);
    }

    @Override
    @Transactional
    public ChatGroup createGroup(ChatGroup group) {
        ChatGroup saved = groupRepository.save(group);
        // Add creator as admin
        ChatGroupUser member = new ChatGroupUser();
        member.setGroupId(saved.getId());
        member.setUserId(group.getCreatedBy());
        member.setRole(2); // Admin
        member.setAddedBy(group.getCreatedBy());
        groupUserRepository.save(member);
        return saved;
    }

    @Override
    public List<ChatGroupUser> getGroupMembers(String groupId) {
        return groupUserRepository.findByGroupId(groupId);
    }

    @Override
    @Transactional
    public ChatGroupUser addGroupMember(String groupId, Long userId, Long addedBy) {
        ChatGroupUser cgu = new ChatGroupUser();
        cgu.setGroupId(groupId);
        cgu.setUserId(userId);
        cgu.setRole(1); // Regular member
        cgu.setAddedBy(addedBy);
        return groupUserRepository.save(cgu);
    }
}
