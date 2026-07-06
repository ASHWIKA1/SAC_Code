package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemSell;
import java.util.List;

public interface ItemSellService {
    List<ItemSell> getAll();
    ItemSell getById(Long id);
    ItemSell create(ItemSell entity);
    ItemSell update(Long id, ItemSell entity);
    void delete(Long id);
}
