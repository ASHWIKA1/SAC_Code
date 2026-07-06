package com.sac.erp.modules.ai.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ai_content_settings")
public class AiContentSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ai_default_model")
    private String aiDefaultModel = "gpt-3.5-turbo-instruct";

    @Column(name = "ai_default_language")
    private String aiDefaultLanguage = "en";

    @Column(name = "ai_default_tone")
    private String aiDefaultTone = "professional";

    @Column(name = "ai_max_result_length")
    private Integer aiMaxResultLength = 500;

    @Column(name = "ai_default_creativity")
    private String aiDefaultCreativity = "0.5";

    @Column(name = "open_ai_secret_key")
    private String openAiSecretKey;
}
