package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.*;
import java.util.List;

public interface CmsService {
    List<Course> getAllCourses();
    Course createCourse(Course course);

    List<Event> getAllEvents();
    Event createEvent(Event event);

    List<Holiday> getAllHolidays();
    Holiday createHoliday(Holiday holiday);

    List<News> getAllNews();
    News publishNews(News news);
}
