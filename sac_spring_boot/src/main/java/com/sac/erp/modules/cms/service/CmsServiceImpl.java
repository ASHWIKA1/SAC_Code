package com.sac.erp.modules.cms.service;

import com.sac.erp.modules.cms.entity.*;
import com.sac.erp.modules.cms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CmsServiceImpl implements CmsService {

    private final CourseRepository courseRepository;
    private final EventRepository eventRepository;
    private final HolidayRepository holidayRepository;
    private final NewsRepository newsRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        return courseRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getAllEvents() {
        return eventRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Holiday> getAllHolidays() {
        return holidayRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Holiday createHoliday(Holiday holiday) {
        return holidayRepository.save(holiday);
    }

    @Override
    @Transactional(readOnly = true)
    public List<News> getAllNews() {
        return newsRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public News publishNews(News news) {
        if (news.getPublishDate() == null) {
            news.setPublishDate(LocalDate.now());
        }
        return newsRepository.save(news);
    }
}
