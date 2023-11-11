Feature: Another Simple API Endpoint
  Scenario: 2 API returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data


  Scenario: 2 Second API also returns data from PostgreSQL
    When I make a GET request to "/"
    Then the response status code should be 200
    And the response should contain data