package com.nubila.nubila;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class NubilaApplication {

    public static final String APPLICATION_LOCATIONS = "spring.config.location="
            + "/home/ec2-user/app/config/springboot-webservice/application.properties,"
            + "/home/ec2-user/app/config/springboot-webservice/real-application.yml";

    public static void main(String[] args) {
        new SpringApplicationBuilder(NubilaApplication.class)
                .properties(APPLICATION_LOCATIONS)
                .run(args);
    }
}