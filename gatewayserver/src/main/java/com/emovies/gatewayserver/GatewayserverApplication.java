package com.emovies.gatewayserver;

import java.time.LocalDateTime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GatewayserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayserverApplication.class, args);
	}

//	@Bean
//	RouteLocator propertiesRouteConfig(RouteLocatorBuilder routeLocatorBuilder) {
//
//		return routeLocatorBuilder.routes().route(p -> p.path("/api/v1/moviesapp/**")
//				.filters(f -> f.rewritePath("/(?<segment>.*)", "/${segment}").addResponseHeader("X-Response-Time",
//						LocalDateTime.now().toString()))
//				.uri("lb://MOVIESSERVICE"))
//				.route(p -> p.path("/api/v1/movies/**")
//						.filters(f -> f.rewritePath("/(?<segment>.*)", "/${segment}")
//								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
//								.addResponseHeader("Access-Control-Allow-Origin", "*")
//                                .addResponseHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
//                                .addResponseHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
//                                .addRequestHeader("Access-Control-Allow-Origin", "*"))
//						.uri("lb://USERMS"))
//				.build();
//	}

}
