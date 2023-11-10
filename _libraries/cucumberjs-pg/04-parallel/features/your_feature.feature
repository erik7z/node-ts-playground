Feature: Simple API Endpoint
  Scenario: API returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data

  Scenario: Second API also returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data