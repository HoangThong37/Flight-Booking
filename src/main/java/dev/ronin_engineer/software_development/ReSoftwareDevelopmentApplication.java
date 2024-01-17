package dev.ronin_engineer.software_development;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.context.annotation.PropertySource;

// @PropertySource(value = "classpath:errors.properties", encoding = "UTF-8")
@SpringBootApplication
@Slf4j
public class ReSoftwareDevelopmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReSoftwareDevelopmentApplication.class, args);
    }

}
