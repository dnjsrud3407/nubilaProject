package com.nubila.nubila;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;


// 메인 Configuration 위치에서 하위 패키지는 디폴트로 스캔하므로
// 따로 스캔할 패키지 위치를 지정할 필요가 없는 것 같음.
//@ComponentScan(basePackages = {"com.nubila.nubila.bookmark"})
//@MapperScan(basePackages = {"com.nubila.nubila.bookmark"})

@SpringBootApplication
public class NubilaApplication {

	public static final String APPLICATION_LOCATIONS = "spring.config.location="
			+ "classpath:application.yml,"
			+ "/app/config/springboot-webservice/real-application.yml";

	public static void main(String[] args) {
		new SpringApplicationBuilder(NubilaApplication.class)
				.properties(APPLICATION_LOCATIONS)
				.run(args);
	}

}
