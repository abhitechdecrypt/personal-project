package com.movies.moviesservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
            title = "E-movies microservice REST API Documentation",
            description = "Properties E-movies microservice REST API Documentation",
            version = "v1",
            contact = @Contact(
                    name = "Abhishek Kumar",
                    email = "abhishek.kumar@gmail.com",
                    url = "https://www.abhishektech.in"
            ),
            license = @License(
                    name = "Apache 2.0",
                    url = "https://www.abhishektech.in"
            )
    ),
    servers = {
        @Server(
            url = "http://:8083/",  
            description = "Production Server"
        ),
        @Server(
            url = "http://localhost:8083/",  
            description = "Staging Server"
        )
    },
    externalDocs = @ExternalDocumentation(
            description = "E-Movies microservice REST API Documentation",
            url = "https://www.abhishektech.in"
    )
)
public class MoviesserviceApplication {
	
    public static void main(String[] args) {
        SpringApplication.run(MoviesserviceApplication.class, args);
    }
}

