package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemSellChild;
import java.util.List;

public interface ItemSellChildService {
    List<ItemSellChild> getAll();
    ItemSellChild getById(Long id);
    ItemSellChild create(ItemSellChild entity);
    ItemSellChild update(Long id, ItemSellChild entity);
    void delete(Long id);
}
