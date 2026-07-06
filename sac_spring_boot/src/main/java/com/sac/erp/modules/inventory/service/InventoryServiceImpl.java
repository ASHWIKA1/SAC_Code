package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.*;
import com.sac.erp.modules.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final ItemCategoryRepository itemCategoryRepository;
    private final ItemStoreRepository itemStoreRepository;
    private final ItemRepository itemRepository;
    private final ItemIssueRepository itemIssueRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemCategory> getAllItemCategories() {
        return itemCategoryRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public ItemCategory createItemCategory(ItemCategory category) {
        return itemCategoryRepository.save(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemStore> getAllItemStores() {
        return itemStoreRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public ItemStore createItemStore(ItemStore store) {
        return itemStoreRepository.save(store);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Item> getAllItems() {
        return itemRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    @Override
    @Transactional
    public ItemIssue issueItem(Long itemId, Long userId, Long roleId, Integer quantity) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        int qty = quantity != null ? quantity : 1;
        if (item.getTotal() != null && item.getTotal() < qty) {
            throw new RuntimeException("Item out of stock");
        }

        if (item.getTotal() != null) {
            item.setTotal(item.getTotal() - qty);
            itemRepository.save(item);
        }

        ItemIssue issue = new ItemIssue();
        issue.setItemId(itemId);
        issue.setIssueTo(userId);
        issue.setRoleId(roleId);
        issue.setIssueDate(LocalDate.now());
        issue.setIssueStatus("I"); // Issued
        issue.setSchoolId(item.getSchoolId());

        return itemIssueRepository.save(issue);
    }

    @Override
    @Transactional
    public ItemIssue returnItem(Long issueId) {
        ItemIssue issue = itemIssueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Item Issue record not found"));

        if ("R".equalsIgnoreCase(issue.getIssueStatus())) {
            throw new RuntimeException("Item has already been returned");
        }

        Item item = itemRepository.findById(issue.getItemId())
                .orElseThrow(() -> new RuntimeException("Item associated with issue record not found"));

        if (item.getTotal() != null) {
            item.setTotal(item.getTotal() + 1); // increment by 1
            itemRepository.save(item);
        }

        issue.setIssueStatus("R"); // Returned
        issue.setReturnDate(LocalDate.now());

        return itemIssueRepository.save(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemIssue> getIssuesByUser(Long userId) {
        return itemIssueRepository.findByIssueTo(userId);
    }
}
