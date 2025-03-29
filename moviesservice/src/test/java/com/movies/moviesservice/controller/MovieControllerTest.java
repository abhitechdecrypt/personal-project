package com.movies.moviesservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.movies.moviesservice.entity.Booking;
import com.movies.moviesservice.entity.Cinema;
import com.movies.moviesservice.entity.Movie;
import com.movies.moviesservice.service.BookingService;
import com.movies.moviesservice.service.MoviesSerives;


class MovieControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MoviesSerives moviesSerives;

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private MovieController movieController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(movieController).build();
    }

    @Test
    void testCreateMovie() throws Exception {
        String movieJson = "{"
                + "\"id\":1,"
                + "\"title\":\"Inception\","
                + "\"director\":\"Christopher Nolan\","
                + "\"image\":\"image.jpg\","
                + "\"ratings\":\"PG-13\","
                + "\"genre\":\"Sci-Fi\","
                + "\"length\":\"148 min\","
                + "\"releasedDate\":\"2010-07-16\","
                + "\"language\":\"English\","
                + "\"cinemas\":[]"
                + "}";

        Movie movie = new Movie(
            1L, 
            "Inception", 
            "Christopher Nolan", 
            "image.jpg", 
            "PG-13", 
            "Sci-Fi", 
            "148 min", 
            LocalDate.of(2010, 7, 16), 
            "English", 
            new HashSet<>()
        );
        when(moviesSerives.createMovie(any(Movie.class))).thenReturn(movie);

        mockMvc.perform(post("/api/v1/moviesapp/movies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(movieJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Inception"));
    }

    @Test
    void testFindAllMovies() throws Exception {
        Movie movie1 = new Movie(1L, "Inception", "Christopher Nolan", "image1.jpg", "PG-13", "Sci-Fi", "148 min", LocalDate.of(2010, 7, 16), "English", new HashSet<>());
        Movie movie2 = new Movie(2L, "Interstellar", "Christopher Nolan", "image2.jpg", "PG-13", "Sci-Fi", "169 min", LocalDate.of(2014, 11, 7), "English", new HashSet<>());

        when(moviesSerives.listMovie()).thenReturn(Arrays.asList(movie1, movie2));

        mockMvc.perform(get("/api/v1/moviesapp/movies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Inception"))
                .andExpect(jsonPath("$[1].title").value("Interstellar"));
    }

    @Test
    void testGetCinemasByMovieId() throws Exception {
        Cinema cinema = new Cinema(1L, "Cinema 1", "123 Street", 5, 200, "Dolby Sound", false, new HashSet<>());
        Set<Cinema> cinemas = new HashSet<>();
        cinemas.add(cinema);

        when(moviesSerives.getCinemasByMovieId(1L)).thenReturn(cinemas);

        mockMvc.perform(get("/api/v1/moviesapp/movies/1/cinemas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Cinema 1"));
    }

    @Test
    void testCreateBooking() throws Exception {
        // Use a proper format for LocalDateTime in the JSON string
        String createBooking = "{"
                + "\"id\":1,"
                + "\"name\":\"John Doe\","
                + "\"email\":\"john.doe@example.com\","
                + "\"seats\":2,"
                + "\"movieId\":1,"
                + "\"cinemaId\":1,"
                + "\"bookingDate\":\"2024-08-28T00:00:00\","
                + "\"bookingStatus\":\"Booked\""
                + "}";

        // Create a Booking object with the same values
        Booking booking = new Booking(1L, "John Doe", "john.doe@example.com",
                LocalDate.of(2024, 8, 28).atStartOfDay(), 1L, 1L, 2, "Booked");

        // Mock the service method to return the booking
        when(bookingService.createBooking(any(Booking.class))).thenReturn(booking);

        // Perform the POST request and verify the response
        mockMvc.perform(post("/api/v1/moviesapp/booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createBooking))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.bookingStatus").value("Booked"));
    }


    @Test
    void testFindBookingByEmail() throws Exception {
        Booking booking = new Booking(1L, "John Doe", "john.doe@example.com", LocalDate.of(2024, 8, 28).atStartOfDay(), 1L, 1L, 2, "CONFIRMED");
        List<Booking> bookings = Arrays.asList(booking);

        when(bookingService.findBookingByEmail("john.doe@example.com")).thenReturn(bookings);

        mockMvc.perform(get("/api/v1/moviesapp/booking").param("email", "john.doe@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("john.doe@example.com"));
    }

    @Test
    void testCancelBooking() throws Exception {
        // Arrange
        when(bookingService.bookingCanclled(1L)).thenReturn("cancelled");

        // Act & Assert
        mockMvc.perform(put("/api/v1/moviesapp/booking/1")
                .param("cancel", "true"))  // Ensure this parameter is correctly set
                .andExpect(status().isOk())
                .andExpect(content().string("Booking cancelled Successfully"));
    }

}
