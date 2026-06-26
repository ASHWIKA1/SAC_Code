package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.*;
import java.util.List;

public interface LibraryService {
    List<Book> getAllBooks();
    Book createBook(Book book);

    LibraryMember addLibraryMember(LibraryMember member);
    LibraryMember getMemberByUniqueId(String cardId);

    BookIssue issueBook(Long bookId, String cardId, Integer days);
    BookIssue returnBook(Long issueId);
    List<BookIssue> getIssuesByMember(String cardId);
}
