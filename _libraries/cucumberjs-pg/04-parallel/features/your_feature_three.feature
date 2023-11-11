Feature: Simple API Endpoint 3

  Scenario: 1 API returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data

  Scenario: 2 Second API also returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data

  Scenario: 3 Second API also returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data

  Scenario: 4 Second API also returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data