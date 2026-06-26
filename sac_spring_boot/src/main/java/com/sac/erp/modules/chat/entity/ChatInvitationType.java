package com.sac.erp.modules.chat.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_invitation_types")
public class ChatInvitationType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invitation_id", nullable = false)
    private Long invitationId;

    @Convert(converter = InvitationTypeConverter.class)
    @Column(name = "`type`", columnDefinition = "ENUM('one-to-one','group','class-teacher')", nullable = false)
    private InvitationType type = InvitationType.one_to_one;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "class_teacher_id")
    private Long classTeacherId;

    public enum InvitationType {
        one_to_one, group, class_teacher
    }

    @Converter
    public static class InvitationTypeConverter implements AttributeConverter<InvitationType, String> {
        @Override
        public String convertToDatabaseColumn(InvitationType attribute) {
            if (attribute == null) return null;
            return attribute.name().replace('_', '-');
        }

        @Override
        public InvitationType convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            return InvitationType.valueOf(dbData.replace('-', '_'));
        }
    }
}
