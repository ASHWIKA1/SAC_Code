package com.sac.erp.modules.chat.service;

import com.sac.erp.modules.chat.entity.*;
import java.util.List;

public interface ChatService {
    ChatStatus getStatus(Long userId);
    ChatStatus saveStatus(Long userId, Integer status);

    ChatBlockUser blockUser(Long blockBy, Long blockTo);
    void unblockUser(Long blockBy, Long blockTo);
    boolean isBlocked(Long user1, Long user2);

    ChatConversation sendMessage(Long fromId, Long toId, String message, Integer messageType, String fileName, String originalFileName);
    List<ChatConversation> getDirectMessages(Long user1, Long user2);

    ChatGroup createGroup(ChatGroup group);
    List<ChatGroupUser> getGroupMembers(String groupId);
    ChatGroupUser addGroupMember(String groupId, Long userId, Long addedBy);
}
