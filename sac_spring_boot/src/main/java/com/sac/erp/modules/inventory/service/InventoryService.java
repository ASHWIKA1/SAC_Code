package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.*;
import java.util.List;

public interface InventoryService {
    List<ItemCategory> getAllItemCategories();
    ItemCategory createItemCategory(ItemCategory category);

    List<ItemStore> getAllItemStores();
    ItemStore createItemStore(ItemStore store);

    List<Item> getAllItems();
    Item createItem(Item item);

    ItemIssue issueItem(Long itemId, Long userId, Long roleId, Integer quantity);
    ItemIssue returnItem(Long issueId);
    List<ItemIssue> getIssuesByUser(Long userId);
}
